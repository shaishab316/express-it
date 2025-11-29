import { Router } from 'express';
import auth from '@/middlewares/auth';
import { AdminRoutes } from '@/modules/admin/Admin.route';
import { AuthRoutes } from '@/modules/auth/Auth.route';
import { UserRoutes } from '@/modules/user/User.route';
import { injectRoutes } from '@/utils/router/injectRouter';
import { ChatRoutes } from '@/modules/chat/Chat.route';
import { MessageRoutes } from '@/modules/message/Message.route';
import { PaymentRoutes } from '@/modules/payment/Payment.route';
import capture from '@/middlewares/capture';
import catchAsync from '@/middlewares/catchAsync';
import { SubscriptionRoutes } from '@/modules/subscription/Subscription.route';
import { TransactionRoutes } from '@/modules/transaction/Transaction.route';

const appRouter = Router();

//? Media upload endpoint
appRouter.post(
  '/upload-media',
  auth.all,
  capture({
    images: {
      size: 15 * 1024 * 1024,
      maxCount: 10,
      fileType: 'images',
    },
    videos: {
      size: 100 * 1024 * 1024,
      maxCount: 10,
      fileType: 'videos',
    },
  }),
  catchAsync(({ body }) => {
    return {
      message: 'Media uploaded successfully!',
      data: body,
    };
  }),
);

export default injectRoutes(appRouter, {
  // no auth required
  '/auth': [AuthRoutes.free],
  '/payments': [PaymentRoutes.free],
  '/subscriptions': [SubscriptionRoutes.free],

  // all user can access
  '/profile': [auth.default, UserRoutes.all],
  '/transactions': [auth.all, TransactionRoutes.all],
  '/inbox': [auth.all, ChatRoutes.all],
  '/messages': [auth.all, MessageRoutes.all],

  // only admin can access
  '/admin': [auth.admin, AdminRoutes.admin],
});
