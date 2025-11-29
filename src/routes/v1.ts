import { Router } from 'express';
import auth from '../app/middlewares/auth';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { injectRoutes } from '../utils/router/injectRouter';
import { ChatRoutes } from '../app/modules/chat/Chat.route';
import { MessageRoutes } from '../app/modules/message/Message.route';
import { PaymentRoutes } from '../app/modules/payment/Payment.route';
import capture from '../app/middlewares/capture';
import catchAsync from '../app/middlewares/catchAsync';
import { SubscriptionRoutes } from '../app/modules/subscription/Subscription.route';
import { TransactionRoutes } from '../app/modules/transaction/Transaction.route';

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
