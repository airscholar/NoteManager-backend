import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUsers(): Promise<User[] | Error> {
    try {
      const users = await this.find({});
      return users;
    } catch (error) {
      return new InternalServerErrorException('Unable to retrieve users');
    }
  }

  async findByEmail(email: string): Promise<User | Error> {
    const user = await this.findOne({ email });

    if (!user) {
      return new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: number): Promise<User | Error> {
    const user = await this.findOne({ id });

    if (!user) {
      return new NotFoundException('User not found');
    }

    return user;
  }

  async assignUser(user: User, userDTO: CreateUserDTO | UpdateUserDTO) {
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.dateOfBirth = userDTO.dateOfBirth;
    user.phoneNumber = userDTO.phoneNumber;
    user.address = userDTO.address;
    user.passwordHash = await this.hashPassword(userDTO.password);
    user.email = userDTO.email;
    user.dateHired = userDTO.dateHired;
    user.salary = userDTO.salary;

    return user;
  }

  async createUser(userDTO: CreateUserDTO): Promise<User | Error> {
    const existing = await this.findByEmail(userDTO.email);

    if (existing instanceof Error) {
      return existing;
    }

    if (existing) {
      return new UnauthorizedException('User already exists');
    }

    const user = await this.assignUser(new User(), userDTO);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.role = 'User';

    try {
      await this.save(user);

      return user;
    } catch (error) {
      return new InternalServerErrorException('Unable to create user');
    }
  }

  async findByIdAndUpdate(
    id: number,
    userDTO: UpdateUserDTO,
  ): Promise<User | Error> {
    const emp = await this.findById(id);

    if (!emp || emp instanceof Error) {
      return new NotFoundException('emp not found');
    }

    try {
      const user = await this.assignUser(emp, userDTO);
      user.updatedAt = new Date();

      await this.save(user);
      return user;
    } catch (error) {
      return new NotFoundException('Unable to update user');
    }
  }

  async findByIdAndDelete(id: number): Promise<User | Error> {
    const response = await this.findById(id);

    if (response instanceof Error) {
      return response;
    }

    if (!response) {
      return new NotFoundException('User not found');
    }

    try {
      await this.remove(response);
    } catch (error) {
      return new InternalServerErrorException('Unable to delete user');
    }

    return;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async login(loginDTO: LoginDTO): Promise<User | Error> {
    const { username, password } = loginDTO;

    const res = await this.findByEmail(username);

    if (res instanceof Error) {
      return new UnauthorizedException('Invalid credentials');
    }

    if (!res) {
      return new UnauthorizedException('Username or Password invalid!');
    }

    const isValid = await bcrypt.compare(password, res.passwordHash);
    if (!isValid) {
      return new UnauthorizedException('Username or Password invalid!');
    }

    return res;
  }
}
