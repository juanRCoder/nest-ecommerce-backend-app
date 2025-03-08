import { UserDto } from "src/users/dto/user.dto";

export type signInDto = Omit<UserDto, 'name'>;