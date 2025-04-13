import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private configService: ConfigService){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User data not found');
    }

    const ADMIN = this.configService.get<string>('ADMIN');
    if (user.role !== ADMIN) {
      throw new ForbiddenException('You do not have permission for this consultation');
    }

    return true;
  }
}
