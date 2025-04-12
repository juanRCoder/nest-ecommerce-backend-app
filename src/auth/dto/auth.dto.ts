import { OmitType, PartialType } from "@nestjs/mapped-types";
import { UserDto } from "src/users/dto/users.dto";

export class signInDto extends OmitType(PartialType(UserDto), [
  'name', 'phone',
] as const) {}