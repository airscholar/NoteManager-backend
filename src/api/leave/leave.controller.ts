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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserGuard } from '../guards/user.guard';

@Controller('leave')
@ApiTags('Leave')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave' })
  async create(@Body() createLeaveDTO: CreateLeaveDTO) {
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

    return await this.leaveService.create(createLeaveDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leaves' })
  async findAll() {
    return await this.leaveService.findAll();
  }

  @Get('user/:email')
  @ApiOperation({ summary: 'Get leave by user email' })
  async findByEmail(@Param('email') email: string) {
    return await this.leaveService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave by ID' })
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    if (!id || !user) {
      throw new BadRequestException('Invalid request');
    }

    return await this.leaveService.findOne(+id);
  }

  @Get('user/:email/getLeave')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get leave by user email' })
  async findLeaveByEmail(@Param('email') email: string, @GetUser() user: User) {
    if (!email || !user) {
      throw new BadRequestException('Invalid request');
    }

    if (user.email !== email && user.role !== 'Admin') {
      throw new BadRequestException(
        'You are not authorized to view this leave',
      );
    }

    //default to current user
    if (user.role !== 'Admin') {
      email = user.email;
    }

    return await this.leaveService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update leave by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateLeaveDTO: UpdateLeaveDTO,
  ) {
    return await this.leaveService.update(+id, updateLeaveDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete leave by ID' })
  async remove(@Param('id') id: string) {
    return await this.leaveService.remove(+id);
  }
}
