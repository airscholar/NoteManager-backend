import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import serverConfig from 'src/config/env.config';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = await this.validate(request);
    return true;
  }

  async validate(request: any) {
    const Authorization = request.get('Authorization');

    if (!Authorization) {
      throw new ForbiddenException('Unauthorized request');
    }

    if (Authorization.split(' ')[0].toLowerCase() !== 'Bearer'.toLowerCase()) {
      throw new ForbiddenException('Unauthorized request');
    }
    const token: string = Authorization.split(' ')[1];
    try {
      const username = await this.verifyToken(token);
      const userAccount = await this.userRepository.findByEmail(
        String(username),
      );

      if (!userAccount || userAccount instanceof Error)
        throw new ForbiddenException('Unauthorized request');
      if (userAccount.role.toLowerCase() !== 'admin')
        throw new ForbiddenException('Forbidden request');

      return {
        ...userAccount,
        token: token,
      };
    } catch (error) {
      throw new ForbiddenException('Unauthorized request');
    }
  }

  async verifyToken(token: string) {
    return await jwt.verify(token, serverConfig.JWT_SECRET);
  }
}
