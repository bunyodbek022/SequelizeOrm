import { IsString } from "class-validator";
export class CreateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  password: string;

  @IsString()
  email: string
}