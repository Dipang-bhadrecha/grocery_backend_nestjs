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
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async userRegister(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserRespnonse> {
    return await this.userService.updateUserById(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ): Promise<UpdateUserRespnonse> {
    return this.userService.changePassword(changePasswordDto, user);
  }
}
