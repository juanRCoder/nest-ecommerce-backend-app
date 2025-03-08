export class UserDto {
  name: string
  email: string
  password: string
}

export type UpdateUserDto = Partial<UserDto>;