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
import { UpdateUserDto } from './dto/users.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(TokenGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user; // return token data
  }

  @UseGuards(TokenGuard, RoleGuard)
  @Get()
  findAll() {
    return this.usersService.findAllUsers()
  }

  @Get(':id')
  findOne(@Param('id') id: ReturnType<typeof uuidv4>) {
    return this.usersService.findOneUser(id);
  }

  @UseGuards(TokenGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: ReturnType<typeof uuidv4>,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateData);
  }
}
