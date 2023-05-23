import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '../user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartTable: Repository<Cart>,

    private productService: ProductService,
  ) {}

  //create Cart
  async create(createCartDto: CreateCartDto, user: User): Promise<Cart> {
    try {
      const { product_id, qty } = createCartDto;

      const product = await this.productService.findOne(product_id);

      const exists = await this.cartTable.findOneBy({ product_id });
      if (exists) {
        const newQty = exists.qty + qty;

        if (newQty <= product.qty) {
          exists.qty = newQty;
          return this.cartTable.save(exists);
        }
        throw new HttpException('Out Of Stock', HttpStatus.NOT_FOUND);
      }

      const item = new Cart();
      item.product_id = createCartDto.product_id;
      item.user_id = user.id;
      item.qty = createCartDto.qty;
      await this.cartTable.save(item);
      return item;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
