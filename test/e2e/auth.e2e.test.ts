import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '@/app';
import { faker } from '@faker-js/faker';
import type { TUserRegister } from '@/modules/user/User.interface';
import { EUserRole } from '@db';

const _user = {
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
};

describe('Auth E2E Tests', () => {
  it('POST /api/v1/auth/register - should register a new user', async () => {
    const payload = {
      email: _user.email,
      password: _user.password,
      role: EUserRole.USER,
    } satisfies TUserRegister;

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(payload);

    const expected = {
      success: true,
      statusCode: 201,
      message: expect.any(String),
      data: {
        access_token: expect.any(String),
        refresh_token: expect.any(String),
        user: {
          id: expect.stringMatching(/^us-\w+$/),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          role: payload.role,
          email: payload.email,
          is_verified: false, // should be false until email verification
          is_active: false, // should be false until email verification
          is_admin: false, // should be false for regular users
          avatar: expect.any(String),
          name: expect.any(String),
          gender: expect.any(String),
          balance: 0, // default balance
          is_stripe_connected: false,
          subscription_name: null, // default subscription
        },
      },
    };

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(expected);
  });
});
