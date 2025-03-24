export interface UserDto {
  name: string
  email: string
  password: string
}

export type UpdateUserDto = Partial<Omit<UserDto, 'password'>>;