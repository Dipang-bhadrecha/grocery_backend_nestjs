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
import DeleteResponseDto from 'src/utils/delete-response.dto';
import CreateResponseDto from 'src/utils/create-respons.dto';
import { Product } from '../product/entities/product.entity';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  findAll(): Promise<CreateResponseDto> {
    return this.cartService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  findOne(@Param('id') id: string): Promise<CreateResponseDto> {
    return this.cartService.findOne(+id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return this.cartService.remove(+id);
  }
}
