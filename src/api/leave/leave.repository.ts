import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateLeaveDTO } from './dto/create-leave.dto';
import { UpdateLeaveDTO } from './dto/update-leave.dto';
import { Leave } from './entities/leave.entity';

@EntityRepository(Leave)
export class LeaveRepository extends Repository<Leave> {
  async createLeave(createLeaveDTO: CreateLeaveDTO, user: User) {
    const leave = await this.assignLeaveObject(new Leave(), createLeaveDTO);

    leave.user = user;

    return await this.save(leave);
  }

  async findByUserId(userId: number): Promise<Leave[]> {
    return await this.find({
      where: {
        userId,
      },
    });
  }

  async findById(id: number) {
    const leave = await this.findOne(id);

    if (!leave) {
      return new NotFoundException('Leave record not found');
    }

    return leave;
  }

  async findByIdAndUpdate(
    id: number,
    updateLeaveDTO: UpdateLeaveDTO,
    user: User,
  ) {
    const existingLeave = await this.findOne(id);

    if (!existingLeave || existingLeave instanceof Error) {
      return existingLeave;
    }

    const leave = await this.assignLeaveObject(existingLeave, updateLeaveDTO);
    leave.user = user;

    return await this.save(leave);
  }

  async findByIdAndRemove(id: number) {
    const existingLeave = await this.findOne(id);

    if (!existingLeave) {
      return existingLeave;
    }

    return await this.remove(existingLeave);
  }

  async assignLeaveObject(
    leave: Leave,
    leaveDTO: CreateLeaveDTO | UpdateLeaveDTO,
  ) {
    leave.startDate = leaveDTO.startDate;
    leave.endDate = leaveDTO.endDate;
    leave.leaveType = leaveDTO.leaveType;
    leave.status = leaveDTO.status;
    leave.comments = leaveDTO.comments;

    return leave;
  }
}
