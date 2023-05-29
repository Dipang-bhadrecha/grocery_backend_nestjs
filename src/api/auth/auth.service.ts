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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = loginDto;

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Please check your login credentials');
      }

      const passwordValidate = await bcrypt.compare(password, user.password);

      if (!passwordValidate) {
        throw new UnauthorizedException('Please check your login credentials');
      }

      const payload: JwtPayload = { email: user.email, role: user.role };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
