import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDTO } from './dto/create-leave.dto';
import { UpdateLeaveDTO } from './dto/update-leave.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('leave')
@UseGuards(AdminGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Body() createLeaveDTO: CreateLeaveDTO) {
    if (createLeaveDTO.startDate > createLeaveDTO.endDate) {
      throw new BadRequestException('Start date must be less than end date');
    }

    if (createLeaveDTO.startDate === createLeaveDTO.endDate) {
      throw new BadRequestException(
        'Start date and end date must be different',
      );
    }

    if (
      createLeaveDTO.startDate <= new Date() ||
      createLeaveDTO.endDate <= new Date()
    ) {
      throw new BadRequestException("Leave can't be in the past");
    }

    return this.leaveService.create(createLeaveDTO);
  }

  @Get()
  findAll() {
    return this.leaveService.findAll();
  }

  @Get('user/:email')
  findByEmail(@Param('email') email: string) {
    return this.leaveService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDTO: UpdateLeaveDTO) {
    return this.leaveService.update(+id, updateLeaveDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }
}
