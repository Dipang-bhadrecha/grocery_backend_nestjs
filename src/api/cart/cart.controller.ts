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
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  @Post('create')
  create(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: User,
  ): Promise<object> {
    return this.cartService.create(createCartDto, user);
  }

  @Get()
  findAll(): Promise<object> {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<object> {
    return this.cartService.findOne(+id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string): Promise<object> {
    return this.cartService.remove(+id);
  }
}
