import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/helpers/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,12}$/, {
    message:
      'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.',
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  role?: Role;
}
