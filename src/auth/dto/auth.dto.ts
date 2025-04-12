import { UserDto } from "src/users/dto/users.dto";

export type signInDto = Omit<UserDto, 'name' | 'phone'>;