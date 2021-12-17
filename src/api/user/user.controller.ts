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

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<IServiceResponse> {
    const res = await this.userService.login(loginDTO);

    if (res instanceof UnauthorizedException) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return res;
  }
  @Post('users')
  @UseGuards(AdminGuard)
  async create(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.create(createUserDTO);
  }

  @Get('users')
  @UseGuards(AdminGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Delete('users/:id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @Get('users/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch('users/:id')
  @UseGuards(UserGuard)
  async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return await this.userService.update(+id, updateUserDTO);
  }
}
