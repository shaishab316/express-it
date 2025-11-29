import { SubscriptionServices } from '../src/modules/subscription/Subscription.service';

await SubscriptionServices.renewSubscriptionsAndWebhook();

process.exit(0);
