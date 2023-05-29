import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

import * as path from 'path';
import * as fs from 'fs';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import CreateResponseDto from 'src/utils/create-respons.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';
import {
  CATEGORY_CREATED_MESSAGE,
  PRODUCT_DELETED_MESSAGE,
  PRODUCT_NOTFOUND_MESSAGE,
  PRODUCT_RETRIEVED_MESSAGE,
  PRODUCT_UPDATED_MESSAGE,
} from 'src/helpers/message';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // create product
  async create(createProduct: CreateProductDto): Promise<CreateResponseDto> {
    try {
      const product = new Product();
      product.name = createProduct.name;
      product.description = createProduct.description;
      product.image_url = createProduct.image_url;
      product.price = createProduct.price;
      product.qty = createProduct.qty;
      product.category = createProduct.category_id;

      const result = await this.productRepository.save(product);
      return {
        statusCode: 201,
        message: CATEGORY_CREATED_MESSAGE,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get all products
  async findAll(
    name: string,
    page: number = 1,
    limit: number,
  ): Promise<CreateResponseDto> {
    try {
      const limit = 10;
      const skip = (page - 1) * limit;
      const product = this.productRepository.createQueryBuilder('product');

      if (name) {
        product.where('product.name LIKE :name', { name: `%${name}%` });
      }

      product.skip(skip).take(limit);
      const products = await product.getMany();

      if (products.length === 0) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: 200,
        message: PRODUCT_RETRIEVED_MESSAGE,
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // get product by id
  async findOne(id: number): Promise<CreateResponseDto> {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        throw new HttpException('product not found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: 200,
        message: PRODUCT_RETRIEVED_MESSAGE,
        data: product,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update product by id
  async update(
    id: number,
    updateProduct: UpdateProductDto,
  ): Promise<UpdateResponseDto> {
    try {
      const productExits = await this.productRepository.find({
        where: { id, is_active: true },
      });
      if (productExits.length == 0) {
        throw Object.assign(new Error(PRODUCT_NOTFOUND_MESSAGE), {
          status: 404,
        });
      }

      productExits.map((product) => {
        product.image_url.map((val) => {
          const filePath = path.join(__dirname, '../../../files', val);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });

      const product = new Product();
      product.name = updateProduct.name;
      product.description = updateProduct.description;
      product.image_url = updateProduct.image_url;
      product.price = updateProduct.price;
      product.qty = updateProduct.qty;
      product.is_active = updateProduct.is_active;
      product.category = updateProduct.category_id;

      const result = await this.productRepository.update(id, product);

      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: PRODUCT_UPDATED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // delete product by id
  async remove(id: number): Promise<DeleteResponseDto> {
    try {
      const productExits = await this.productRepository.count({
        where: { id },
      });
      if (productExits == 0) {
        throw Object.assign(new Error(PRODUCT_NOTFOUND_MESSAGE), {
          status: 404,
        });
      }

      const result = await this.productRepository.delete(id);
      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: PRODUCT_DELETED_MESSAGE,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
