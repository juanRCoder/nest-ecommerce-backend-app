export interface UserDto {
  name: string
  email: string
  phone: number
  password: string
}

export type UpdateUserDto = Partial<Omit<UserDto, 'password'>>;