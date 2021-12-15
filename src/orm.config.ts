import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import serverConfig from './config/env.config';
import { User } from './api/user/entities/user.entity';
import { Leave } from './api/leave/entities/leave.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: serverConfig.DATABASE_HOST,
  port: serverConfig.DATABASE_PORT,
  username: serverConfig.DATABASE_USERNAME,
  password: serverConfig.DATABASE_PASSWORD,
  database: serverConfig.DATABASE_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Leave],
};
