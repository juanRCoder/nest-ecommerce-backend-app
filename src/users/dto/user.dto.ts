export interface UserDto {
  name: string
  email: string
  password: string
}

export type UpdateUserDto = Omit<Partial<UserDto>, 'password'>;