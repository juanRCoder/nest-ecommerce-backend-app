import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/auth.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signUpUser: UserDto) {
    return this.authService.signUp(signUpUser)
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() logInUser: signInDto) {
    return this.authService.signIn(logInUser)
  }
}
