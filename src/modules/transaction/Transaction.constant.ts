import { Transaction as TTransaction } from '@db';

export const transactionSearchableFields: (keyof TTransaction)[] = [
  'stripe_transaction_id',
  'subscription_name',
];
