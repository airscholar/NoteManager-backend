import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRepository } from './leave.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRepository, UserRepository])],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
