import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { first_name, last_name, phone, email, password } = createUserDto;

      const existingUser = await this.getUserByEmail(email);

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        first_name,
        last_name,
        phone,
        email,
        password: hashedPassword,
      });

      await this.userRepository.save(user);
      user.password = undefined;

      return user;
    } catch (error) {
      throw new HttpException(error.message,error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const result = await this.userRepository.findOne({ where: { email } });
      return result;
    } catch (e) {
      throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR);  
    }
  }  
}
