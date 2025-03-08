import { v4 as uuidv4 } from 'uuid';
import { UserDto } from "../dto/user.dto";

export type UserEntity = UserDto & {
  id: ReturnType<typeof uuidv4>;
}