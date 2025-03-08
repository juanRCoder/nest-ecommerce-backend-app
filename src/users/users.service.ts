import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: '3f5e1a2b-6c4d-4f98-9e3a-8b7c5d6e1f2a',
      name: 'john',
      email: 'john@gmail.com',
      password: 'john123',
    },
    {
      id: 'a9b8c7d6-e5f4-3a21-b098-7c6d5e4f3a2b',
      name: 'juan',
      email: 'juan@gmail.com',
      password: 'juan123',
    },
  ];

  async findOne(email: string): Promise<UserEntity | undefined> {
    return this.users.find(user => user.email === email);
  }
}
