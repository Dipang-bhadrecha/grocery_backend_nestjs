import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  new_password: string;
}
