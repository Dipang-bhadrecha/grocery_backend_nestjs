import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { CreateCartDto } from './dto/create-cart.dto';
import CreateResponseDto from 'src/utils/create-respons.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  @Post('create')
  create(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: User,
  ): Promise<CreateResponseDto> {
    return this.cartService.create(createCartDto, user);
  }

  @Get()
  findAll(): Promise<CreateResponseDto> {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateResponseDto> {
    return this.cartService.findOne(+id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string): Promise<CreateResponseDto> {
    return this.cartService.remove(+id);
  }
}
