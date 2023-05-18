import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import CreateCategoryResponseDto from './dto/create-category-response.dto';
import UpdateCategoryResponseDto from './dto/update-category-response.dto';
import DeleteCategoryResponseDto from './dto/delete-category-response.dto';


@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  async create(@Body() createCategory: CreateCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<CreateCategoryResponseDto> {
    createCategory.image_url = file.filename;
    return this.categoryService.create(createCategory);
  }


  @Put('/:id')
  @UseInterceptors(FileInterceptor('image_url'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategory: UpdateCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<UpdateCategoryResponseDto> {
    updateCategory.image_url = file.filename;
    return this.categoryService.update(id, updateCategory);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteCategoryResponseDto> {
    return this.categoryService.remove(id);
  }
}
