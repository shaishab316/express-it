import { Router } from 'express';
import auth from '../app/middlewares/auth';
import { AdminRoutes } from '../app/modules/admin/Admin.route';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import { injectRoutes } from '../utils/router/injectRouter';
import { ChatRoutes } from '../app/modules/chat/Chat.route';
import { MessageRoutes } from '../app/modules/message/Message.route';

export default injectRoutes(Router(), {
  // no auth required
  '/auth': [AuthRoutes.free],

  // all user can access
  '/profile': [auth.all, UserRoutes.all],
  '/inbox': [auth.all, ChatRoutes.all],
  '/messages': [auth.all, MessageRoutes.all],

  // only admin can access
  '/admin': [auth.admin, AdminRoutes.admin],
});
