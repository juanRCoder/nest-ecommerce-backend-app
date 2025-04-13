import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/auth.dto';
import { UserDto } from 'src/users/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private async createTokenAndSendData(
    user: UserDto & { id: string; role: string },
  ): Promise<{
    user: { name: string; group: string };
    token: string;
  }> {
    const payload = { id: user.id, email: user.email, role: user.role};
    return {
      user: { name: user.name, group: 'in progress' },
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpUser: UserDto) {
    const findedEmail = await this.prisma.user.findUnique({
      where: { email: signUpUser.email },
    });

    if (findedEmail) {
      throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(signUpUser.password, 10);
    const { password, ...userData } = signUpUser;
    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hash
      },
    });

    const { createAt, updateAt, ...result } = newUser;
    return this.createTokenAndSendData({...result, role: "user"}); //temporary
  }

  async signIn(logInUser: signInDto) {
    const findedUser = await this.prisma.user.findUnique({
      where: { email: logInUser.email },
    });

    if (!findedUser) {
      throw new UnauthorizedException('Unregistered email');
    }
    const isPasswordValid = await bcrypt.compare(
      logInUser.password,
      findedUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('passwords do not match');
    }

    const { createAt, updateAt, ...result } = findedUser;
    return this.createTokenAndSendData(result);
  }
}
