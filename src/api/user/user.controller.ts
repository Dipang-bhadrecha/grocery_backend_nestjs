import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ParseIntPipe,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponse } from './interfaces/create-user-response-interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRespnonse } from './interfaces/update-user-interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async userRegister(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserRespnonse> {
    return await this.userService.updateUserById(id, updateUserDto);
  }
}
