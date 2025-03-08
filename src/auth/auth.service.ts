import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(logInUser: signInDto): Promise<any> {
    const user = await this.UsersService.findOne(logInUser.email);
    if (user?.password !== logInUser.password) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const payload = { ...result }
    return {
      access_tokem: await this.jwtService.signAsync(payload)
    }
  }

}
