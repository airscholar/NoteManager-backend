import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { CreateLeaveDTO } from './dto/create-leave.dto';
import { UpdateLeaveDTO } from './dto/update-leave.dto';
import { LeaveRepository } from './leave.repository';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveRepository: LeaveRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createLeaveDTO: CreateLeaveDTO) {
    if (!createLeaveDTO.email) {
      return new BadRequestException('User email is required');
    }

    const user = await this.findUserByEmail(createLeaveDTO.email);
    if (user instanceof Error) {
      return user;
    }

    return await this.leaveRepository.createLeave(createLeaveDTO, user);
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return new BadRequestException('User does not exist');
    }
    return user;
  }

  async findAll() {
    return await this.leaveRepository.find();
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findOne(id: number) {
    return await this.leaveRepository.findOne(id);
  }

  async findByUserId(userId: number) {
    return await this.leaveRepository.findByUserId(userId);
  }

  async update(id: number, updateLeaveDTO: UpdateLeaveDTO) {
    const user = await this.userRepository.findByEmail(updateLeaveDTO.email);

    if (!user) {
      return new BadRequestException('User does not exist');
    }

    if (user instanceof Error) {
      return user;
    }

    return await this.leaveRepository.findByIdAndUpdate(
      id,
      updateLeaveDTO,
      user,
    );
  }

  async remove(id: number) {
    return await this.leaveRepository.findByIdAndRemove(id);
  }
}
