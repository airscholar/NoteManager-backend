import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveModule } from './api/leave/leave.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UserModule, LeaveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
