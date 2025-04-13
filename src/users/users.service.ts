import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    try {
      const findAllUsers = await this.prisma.user.findMany();
      const usersWithoutPassword = findAllUsers.map((user) => {
        const { createAt, updateAt, password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return usersWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('[findAllUsers service]', error);
    }
  }

  async findOneUser(id: string) {
    try {
      const findedUser = await this.prisma.user.findUnique({
        where: { id },
      });
      const { createAt, updateAt, password, ...result } = findedUser;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('[findOneUser service]', error);
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return { message: 'updated user successfully' };
    } catch (error) {
      throw new InternalServerErrorException('[updateUser service]', error);
    }
  }
}
