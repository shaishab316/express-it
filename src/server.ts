process.stdout.write('\x1Bc'); //? clear console
import startServer from '@/utils/server/startServer';
import { SocketServices } from '@/modules/socket/Socket.service';
import { subscriptionExpireJob } from '@/modules/subscription/Subscription.job';

/**
 * server initialization
 */
const server = await startServer();

/**
 * Add plugins to the server
 */
server.addPlugins(SocketServices.init(server), subscriptionExpireJob());
