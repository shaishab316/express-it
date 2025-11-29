import dotenvx from '@dotenvx/dotenvx';
import path from 'path';

export const envPath = path.resolve(process.cwd(), '.env');

dotenvx.config({ path: envPath });

export default process.env;
