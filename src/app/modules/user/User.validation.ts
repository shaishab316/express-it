import { z } from 'zod';
import { EGender, EUserRole, User as TUser } from '@/utils/db';
import { enum_encode } from '@/utils/transform/enum';
import { TModelZod } from '@/types/zod';

export const UserValidations = {
  userRegister: z.object({
    body: z.object({
      role: z.literal(EUserRole.USER).default(EUserRole.USER),
      email: z.email({ error: 'Email is invalid' }),
      password: z
        .string({ error: 'Password is missing' })
        .min(6, 'Password must be at least 6 characters long'),
    } satisfies TModelZod<TUser>),
  }),

  editProfile: z.object({
    body: z.object({
      role: z.enum(EUserRole).optional(),
      name: z.string().optional(),
      avatar: z
        .string()
        .nullable()
        .transform(val => val ?? undefined),
      gender: z.enum(EGender).optional(),
    } satisfies TModelZod<TUser>),
  }),

  changePassword: z.object({
    body: z.object({
      oldPassword: z
        .string({
          error: 'Old Password is missing',
        })
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string({
          error: 'New Password is missing',
        })
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  getAllUser: z.object({
    query: z.object({
      search: z.string().trim().optional(),
      role: z.string().transform(enum_encode).pipe(z.enum(EUserRole)),
    }),
  }),
};
