import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  Put,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import CreateResponseDto from 'src/utils/create-respons.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Product } from './entities/product.entity';

@ApiTags('product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Post('/create')
  @UseInterceptors(FilesInterceptor('product', 5))
  async create(
    @Body() createProduct: CreateProductDto,
    @UploadedFiles() file: Array<Express.Multer.File>,
  ): Promise<CreateResponseDto> {
    createProduct.image_url = file.map((val) => val.filename);
    return this.productService.create(createProduct);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  async findAll(
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Product[]> {
    return this.productService.findAll(name, page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.USER)
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Put('/:id')
  @UseInterceptors(FilesInterceptor('product', 5))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
    @UploadedFiles() file: Array<Express.Multer.File>,
  ): Promise<UpdateResponseDto> {
    file
      ? (updateProduct.image_url = updateProduct.image_url =
          file.map((val) => val.filename))
      : null;
    return this.productService.update(id, updateProduct);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Delete('/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResponseDto> {
    return this.productService.remove(id);
  }
}
