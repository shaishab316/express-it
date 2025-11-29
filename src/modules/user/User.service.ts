import type { TList } from '../query/Query.interface';
import {
  userSearchableFields as searchFields,
  userSelfOmit,
} from './User.constant';
import { EUserRole, Prisma, prisma, User as TUser } from '@/utils/db';
import { TPagination } from '@/utils/server/serveResponse';
import deleteFilesQueue from '@/utils/mq/deleteFilesQueue';
import type { TUserEdit } from './User.interface';
import ServerError from '@/errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../auth/Auth.utils';
import { generateOTP } from '@/utils/crypto/otp';
import emailQueue from '@/utils/mq/emailQueue';
import { errorLogger } from '@/utils/logger';
import { emailTemplate } from '@/templates/emailTemplate';
import config from '@/config';
import stripeAccountConnectQueue from '@/utils/mq/stripeAccountConnectQueue';

/**
 * User services
 */
export const UserServices = {
  /**
   * Get next user id
   */
  async getNextUserId(
    where:
      | { role: EUserRole; is_admin?: never }
      | { role?: never; is_admin: true },
  ): Promise<string> {
    const prefix = where.role ? where.role.toLowerCase().slice(0, 2) : 'su';

    const user = await prisma.user.findFirst({
      where,
      orderBy: { created_at: 'desc' },
      select: { id: true },
    });

    if (!user) return `${prefix}-1`;

    const currSL = parseInt(user.id.split('-')[1], 10);
    return `${prefix}-${currSL + 1}`;
  },

  /**
   * Register user and send otp
   */
  async register({
    email,
    role,
    password,
    ...payload
  }: Omit<Prisma.UserCreateInput, 'id'>) {
    const existingUser = await prisma.user.findFirst({
      where: { email },
      select: { role: true, is_verified: true, id: true, otp_id: true },
    });

    // Check if verified user already exists
    if (!payload.is_admin && existingUser?.is_verified) {
      throw new ServerError(
        StatusCodes.CONFLICT,
        `${existingUser.role} already exists with this ${email} email.`,
      );
    }

    const hashedPassword = password && (await hashPassword(password));

    const omitFields = {
      ...userSelfOmit[role ?? EUserRole.USER],
      otp_id: false,
      stripe_account_id: false,
    };

    // Update existing unverified user or create new one
    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: { role, password: hashedPassword, ...payload },
          omit: omitFields,
        })
      : await prisma.user.create({
          data: {
            //? Generate user id based on role
            id: await UserServices.getNextUserId(
              payload.is_admin
                ? { is_admin: true }
                : {
                    role: role ?? EUserRole.USER,
                  },
            ),
            email,
            role,
            password: hashedPassword,
            ...payload,
          },
          omit: omitFields,
        });

    //? Queue stripe account creation if needed
    if (!user.stripe_account_id) {
      stripeAccountConnectQueue
        .add({ user_id: user.id })
        .catch(err =>
          errorLogger.error('Failed to queue stripe account:', err),
        );
    }

    // Send verification OTP email
    if (!user.is_verified && user.email) {
      const otp = generateOTP({
        tokenType: 'access_token',
        otpId: user.id + user.otp_id,
      });

      emailQueue
        .add({
          to: user.email,
          subject: `Your ${config.server.name} Account Verification OTP is ⚡ ${otp} ⚡.`,
          html: await emailTemplate({
            userName: user.name,
            otp,
            template: 'account_verify',
          }),
        })
        .catch(err =>
          errorLogger.error('Failed to send verification email:', err),
        );
    }

    return {
      ...user,
      otp_id: undefined,
      stripe_account_id: undefined,
    };
  },

  async updateUser({ user, body }: { user: Partial<TUser>; body: TUserEdit }) {
    const data: Prisma.UserUpdateInput = body;

    if (body.avatar && user.avatar) await deleteFilesQueue.add([user.avatar]);

    if (body.role && body.role !== user.role)
      data.id = await this.getNextUserId({ role: body.role });

    return prisma.user.update({
      where: { id: user.id },
      omit: userSelfOmit[body.role ?? user.role ?? EUserRole.USER],
      data,
    });
  },

  /**
   * Get all users with pagination and search
   */
  async getAllUser({ page, limit, search, role }: TList & { role: EUserRole }) {
    const where: Prisma.UserWhereInput = { role };

    if (search)
      where.OR = searchFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      }));

    const users = await prisma.user.findMany({
      where,
      omit: userSelfOmit[role],
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.user.count({ where });

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        } as TPagination,
      },
      users,
    };
  },

  async getUserById({
    userId,
    omit = undefined,
  }: {
    userId: string;
    omit?: Prisma.UserOmit;
  }) {
    return prisma.user.findUnique({
      where: { id: userId },
      omit,
    });
  },

  async getUsersCount() {
    const counts = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        _all: true,
      },
    });

    return Object.fromEntries(
      counts.map(({ role, _count }: any) => [role, _count._all]),
    );
  },

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.avatar) await deleteFilesQueue.add([user.avatar]);

    return prisma.user.delete({ where: { id: userId } });
  },
};
