import * as dotenv from 'dotenv';
import * as path from 'path';

// Load apps/web/.env (running with cwd=apps/web)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Load root .env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
