import { describe, expect, it } from 'vitest';
import auth, { commonValidator, paymentValidator } from './auth';
import { prisma } from '@/utils/db';
import { encodeToken } from '@/modules/auth/Auth.utils';
import { Request } from 'express';

describe('auth middleware', () => {
  describe('commonValidator', () => {
    it('should allow admin users', () => {
      commonValidator({
        is_admin: true, // admin
        is_verified: false,
        is_active: false,
      } as any);
    });

    it('should throw error for unverified users', () => {
      try {
        commonValidator({
          is_admin: false,
          is_verified: false, // unverified
          is_active: true,
        } as any);

        throw new Error('unverified users can pass validation');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Your account is not verified');
        }
      }
    });

    it('should throw error for inactive users', () => {
      expect(() => {
        commonValidator({
          is_admin: false,
          is_verified: true,
          is_active: false,
        } as any);
      }).toThrow('Your account is not active');
    });
  });

  describe('paymentValidator', () => {
    it('should throw error for users with no subscription', () => {
      try {
        paymentValidator({
          role: 'USER',
          subscription_name: null, // no subscription
          subscription_expires_at: null,
        } as any);
        throw new Error('users with no subscription can pass validation');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe(
            'Your user subscription has expired. Please renew to continue accessing this feature.',
          );
        }
      }
    });
  });

  describe('default auth', async () => {
    it('should authenticate with access token', async () => {
      // Create test user
      const user = await prisma.user.create({
        data: {
          id: 'test-user-id',
        },
      });

      const access_token = encodeToken({ uid: 'test-user-id' }, 'access_token');

      const req = {} as Request;

      /**
       * Test without token
       */
      await new Promise<void>(resolve => {
        auth({ token_type: 'access_token' })(req, {} as any, error => {
          if (error instanceof Error) {
            expect(error.message).toBe('Please provide a valid access token.');
          }
          expect(req.user).toBeUndefined();
          resolve();
        });
      });

      /**
       * Test with token
       */
      req.headers = {
        authorization: `Bearer ${access_token}`,
      };

      await new Promise<void>(resolve => {
        auth({ token_type: 'access_token' })(req, {} as any, error => {
          if (error instanceof Error) {
            expect(error).toBeUndefined();
          }
          expect(req.user.id).toBe('test-user-id');
          resolve();
        });
      });

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should throw if user account is deleted', async () => {
      const access_token = encodeToken(
        { uid: 'non-existent-user-id' },
        'access_token',
      );

      const req = {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      } as Request;

      await new Promise<void>(resolve => {
        auth({ token_type: 'access_token' })(req, {} as any, error => {
          if (error instanceof Error) {
            expect(error.message).toBe(
              'Maybe your account has been deleted. Register again.',
            );
          }
          expect(req.user).toBeUndefined();
          resolve();
        });
      });
    });
  });
});
