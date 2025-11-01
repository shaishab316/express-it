import { Prisma, User as TUser } from '../../../utils/db';

export const userSearchableFields = ['name', 'email'] satisfies (keyof TUser)[];

export const userDefaultOmit = {
  password: true,
  email: true,
  is_verified: true,
  is_active: true,
  is_admin: true,
  updated_at: true,
  created_at: true,
  otp_id: true,
} satisfies Prisma.UserOmit;
