import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UnauthorizedException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { LoginDTO } from './dto/login.dto';
import { IServiceResponse } from '../interface/response.interface';
import { UserGuard } from '../guards/user.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDTO: LoginDTO): Promise<IServiceResponse> {
    const res = await this.userService.login(loginDTO);

    if (res instanceof UnauthorizedException) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return res;
  }
  @Post('users')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.create(createUserDTO);
  }

  @Get('users')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Delete('users/:id')
  @ApiTags('Admin')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete user by ID' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @Get('users/:id')
  @ApiTags('User')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch('users/:id')
  @ApiTags('User')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Update user by id' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
    @GetUser() user,
  ) {
    if (user?.id !== +id) {
      throw new UnauthorizedException(
        'You are not allowed to update this user',
      );
    }
    return await this.userService.update(+id, updateUserDTO);
  }
}
