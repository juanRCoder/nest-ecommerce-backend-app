import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const findAllUsers = await this.prisma.user.findMany()
      const usersWithoutPassword = findAllUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return usersWithoutPassword
    } catch(error) {
      throw new InternalServerErrorException('Failed to get all users');
    }
  }

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
