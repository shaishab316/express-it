import { StatusCodes } from 'http-status-codes';
import ServerError from '@/errors/ServerError';
import { TWithdrawArgs } from './Payment.interface';
import stripeAccountConnectQueue from '@/utils/mq/stripeAccountConnectQueue';
import withdrawQueue from '@/utils/mq/withdrawQueue';

/**
 * Payment Services
 */
export const PaymentServices = {
  /**
   * Withdraw money
   *
   * @event withdraw
   */
  async withdraw({ amount, user }: TWithdrawArgs) {
    if (user.balance < amount) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        "You don't have enough balance",
      );
    }

    if (!user.is_stripe_connected) {
      throw new ServerError(
        StatusCodes.BAD_REQUEST,
        "You haven't connected your Stripe account",
      );
    }

    if (!user.stripe_account_id) {
      await stripeAccountConnectQueue.add({ user_id: user.id });

      throw new ServerError(
        StatusCodes.ACCEPTED,
        'Stripe account connecting. Try again later!',
      );
    }

    await withdrawQueue.add({ amount, user });
  },
};
