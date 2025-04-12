import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: ReturnType<typeof uuidv4>) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: ReturnType<typeof uuidv4>,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateData);
  }
}
