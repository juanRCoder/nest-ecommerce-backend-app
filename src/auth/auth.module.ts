import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule, //disponible en todo el modulo
    JwtModule.registerAsync({
      imports: [ConfigModule], // Aseguramos que ConfigService esté disponible
      inject: [ConfigService], // Inyectamos ConfigService
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
