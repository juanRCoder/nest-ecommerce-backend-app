import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const findedUser = await this.prisma.user.findUnique({
      where: { id },
    });
    const {createAt, updateAt, password, ...result} = findedUser;
    return result
  }

  async updateUser(id: string, updateData: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData
    })
    const {createAt, updateAt, password, ...result} = updatedUser;
    return result
  }
}
