import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '../user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import CreateResponseDto from 'src/utils/create-respons.dto';
import { Product } from '../product/entities/product.entity';
import { error } from 'console';
import {
  CART_CREATED_MESSAGE,
  CART_DELETED_MESSAGE,
  CART_EMPTY_MESSAGE,
  CART_FOUND_MESSAGE,
  CART_NOTFOUND_MESSAGE,
  OUT_OF_STOCK,
} from 'src/helpers/message';
import DeleteResponseDto from 'src/utils/delete-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartTable: Repository<Cart>,

    private productService: ProductService,
  ) {}

  //create Cart
  async create(
    createCartDto: CreateCartDto,
    user: User,
  ): Promise<CreateResponseDto | any> {
    try {
      const { product_id, qty } = createCartDto;

      const product = await this.productService.findOne(product_id);

      const productExists = await this.cartTable
        .createQueryBuilder('cart')
        .where('cart.product_id=:product_id', { product_id })
        .andWhere('cart.user_id=:u_id', { u_id: user.id })
        .getOne();

      if (productExists) {
        const newQty = productExists.qty + qty;
        const newPrice =
          productExists.price + product.data.price * createCartDto.qty;
        if (newQty <= product.data.qty) {
          productExists.qty = newQty;
          productExists.price = newPrice;
          await this.cartTable.save(productExists);
          return {
            statusCode: 201,
            message: CART_CREATED_MESSAGE,
            data: productExists,
          };
        }
        throw new HttpException(OUT_OF_STOCK, HttpStatus.NOT_FOUND);
      }

      const item = new Cart();
      item.product_id = createCartDto.product_id;
      item.user_id = user.id;
      item.qty = createCartDto.qty;
      item.price = product.data.price * qty;
      await this.cartTable.save(item);
      return {
        statusCode: 201,
        message: CART_CREATED_MESSAGE,
        data: item,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //find one by id
  async findOne(id: number): Promise<CreateResponseDto> {
    try {
      const cart = await this.cartTable.findOne({ where: { id } });
      if (!cart) {
        return {
          statusCode: 200,
          message: CART_EMPTY_MESSAGE,
          data: [],
        };
      }
      return {
        statusCode: 200,
        message: CART_FOUND_MESSAGE,
        data: cart,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // find all cart
  async findAll(): Promise<CreateResponseDto> {
    try {
      const carts = await this.cartTable.find();
      if (!carts) {
        throw new HttpException(CART_NOTFOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: 200,
        message: CART_FOUND_MESSAGE,
        data: carts,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Delete cart
  async remove(id: number): Promise<DeleteResponseDto> {
    try {
      const cart = await this.cartTable.findOne({ where: { id } });
      if (!cart) {
        throw new HttpException(CART_NOTFOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      const result = await this.cartTable.delete({ id });
      return {
        statusCode: 204,
        message: CART_DELETED_MESSAGE,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
