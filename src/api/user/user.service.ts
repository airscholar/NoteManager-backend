import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IServiceResponse } from '../interface/response.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as jwt from 'jsonwebtoken';
import serverConfig from 'src/config/env.config';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(CreateUserDTO: CreateUserDTO): Promise<IServiceResponse> {
    const response = await this.userRepository.createUser(CreateUserDTO);

    return response instanceof Error
      ? {
          status: 500,
          message: 'Unable to create user',
        }
      : {
          status: 201,
          message: 'User created successfully!',
          data: response,
        };
  }

  async findAll(): Promise<IServiceResponse> {
    const response = await this.userRepository.findUsers();

    return response instanceof Error
      ? {
          status: 500,
          message: 'Unable to retrieve users',
        }
      : {
          status: 200,
          message: 'Users retrieved successfully!',
          data: response,
        };
  }

  async findOne(id: number): Promise<IServiceResponse> {
    const response = await this.userRepository.findById(id);

    return response instanceof Error
      ? {
          status: 400,
          message: `User with id '${id}' not found`,
        }
      : {
          status: 200,
          message: 'User retrieved successfully!',
          data: response,
        };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDTO,
  ): Promise<IServiceResponse> {
    const response = await this.userRepository.findByIdAndUpdate(
      id,
      updateUserDto,
    );

    return response instanceof Error
      ? {
          status: 500,
          message: 'Unable to update user',
        }
      : {
          status: 200,
          message: 'User updated successfully!',
          data: response,
        };
  }

  async remove(id: number): Promise<IServiceResponse> {
    const response = await this.userRepository.findByIdAndDelete(id);

    return response instanceof Error
      ? {
          status: 500,
          message: 'Unable to delete user',
        }
      : {
          status: 200,
          message: 'User deleted successfully!',
          data: response,
        };
  }

  async login(
    loginDTO: LoginDTO,
  ): Promise<IServiceResponse | UnauthorizedException> {
    const response = await this.userRepository.login(loginDTO);

    if (response instanceof Error) {
      return new UnauthorizedException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(response.email, serverConfig.JWT_SECRET);

    return {
      status: 200,
      message: 'User logged in successfully!',
      data: {
        token,
        user: response,
      },
    };
  }
}
