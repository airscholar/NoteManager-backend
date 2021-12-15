import * as env from 'env-var';
import { config } from 'dotenv';

config();

const PORT = env.get('PORT').asInt();
const NODE_ENV = env.get('NODE_ENV').asString();
const DATABASE_TYPE = env.get('DATABASE_TYPE').asString() || 'postgres';
const DATABASE_HOST = env.get('DATABASE_HOST').asString();
const DATABASE_PORT = env.get('DATABASE_PORT').asInt();
const DATABASE_USERNAME = env.get('DATABASE_USERNAME').asString();
const DATABASE_PASSWORD = env.get('DATABASE_PASSWORD').asString();
const DATABASE_NAME = env.get('DATABASE_NAME').asString();
const JWT_SECRET = env.get('JWT_SECRET').asString();

const serverConfig = {
  NODE_ENV,
  PORT,
  DATABASE_TYPE,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  JWT_SECRET,
};

export default serverConfig;
