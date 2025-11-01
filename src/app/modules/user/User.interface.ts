import type z from 'zod';
import type { UserValidations } from './User.validation';

export type TUserRegister = z.infer<
  typeof UserValidations.userRegister
>['body'];

export type TUserEdit = z.infer<typeof UserValidations.editProfile>['body'];
