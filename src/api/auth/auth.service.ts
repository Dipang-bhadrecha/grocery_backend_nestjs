import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dto/login-dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './interfaces/login-response.dto';
import { INVALID_LOGIN_CREDENTIALS_MESSAGE } from 'src/helpers/message';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.getUserByEmail(loginDto.email);

      if (!user) {
        throw new UnauthorizedException(INVALID_LOGIN_CREDENTIALS_MESSAGE);
      }

      const passwordValidate = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordValidate) {
        throw new UnauthorizedException(INVALID_LOGIN_CREDENTIALS_MESSAGE);
      }

      const payload: JwtPayload = { email: user.email, role: user.role };
      const accessToken: string = await this.jwtService.sign(payload);

      const { id, first_name, last_name, email, phone, role } = user;

      return {
        accessToken,
        statusCode: 201,
        data: { id, first_name, last_name, email, phone, role },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
