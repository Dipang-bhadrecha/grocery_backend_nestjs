import { Controller, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import CreateProductResponseDto from './dto/create-product-response.dto';
import DeleteCategoryResponseDto from '../category/dto/delete-category-response.dto';
import UpdateCategoryResponseDto from '../category/dto/update-category-response.dto';


@ApiTags('product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('/create')
  @UseInterceptors(FilesInterceptor('product', 5))
  async create(@Body() createProduct: CreateProductDto, @UploadedFiles() file: Array<Express.Multer.File>): Promise<CreateProductResponseDto> {
    createProduct.image_url = file.map((val) => val.filename)
    return this.productService.create(createProduct);
  }


  @Put('/:id')
  @UseInterceptors(FilesInterceptor('product', 5))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProduct: UpdateProductDto, @UploadedFiles() file: Array<Express.Multer.File>): Promise<UpdateCategoryResponseDto> {

    file ? updateProduct.image_url = updateProduct.image_url = file.map((val) => val.filename) : null
    return this.productService.update(id, updateProduct);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteCategoryResponseDto> {
    return this.productService.remove(id);
  }
}
