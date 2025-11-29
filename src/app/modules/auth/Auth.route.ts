import { Router } from 'express';
import { AuthControllers } from './Auth.controller';
import { AuthValidations } from './Auth.validation';
import { UserControllers } from '../user/User.controller';
import { UserValidations } from '../user/User.validation';
import purifyRequest from '@/app/middlewares/purifyRequest';
import auth from '@/app/middlewares/auth';
import {
  otpVerifyRateLimiter,
  forgotPasswordRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
} from './Auth.utils';

const free = Router();

free.post(
  '/register',
  registerRateLimiter,
  purifyRequest(UserValidations.userRegister),
  UserControllers.register,
);

free.post(
  '/account-verify',
  otpVerifyRateLimiter,
  purifyRequest(AuthValidations.accountVerify),
  AuthControllers.accountVerify,
);

free.post(
  '/login',
  loginRateLimiter,
  purifyRequest(AuthValidations.login),
  AuthControllers.login,
);

free.post(
  '/account-verify/otp-send',
  purifyRequest(AuthValidations.otpSend),
  AuthControllers.accountVerifyOtpSend,
);

free.post(
  '/forgot-password',
  forgotPasswordRateLimiter,
  purifyRequest(AuthValidations.otpSend),
  AuthControllers.forgotPassword,
);

free.post(
  '/forgot-password/otp-verify',
  otpVerifyRateLimiter,
  purifyRequest(AuthValidations.accountVerify),
  AuthControllers.forgotPasswordOtpVerify,
);

free.post(
  '/reset-password',
  auth.reset_token,
  purifyRequest(AuthValidations.resetPassword),
  AuthControllers.resetPassword,
);

free.get('/logout', AuthControllers.logout);

/**
 * generate new access token
 */
free.get('/refresh-token', auth.refresh_token, AuthControllers.refreshToken);

export const AuthRoutes = {
  /**
   * Everyone can access
   *
   * @url : (base_url)/auth/
   */
  free,
};
