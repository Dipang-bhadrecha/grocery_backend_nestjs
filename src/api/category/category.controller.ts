import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import CreateCategoryResponseDto from './dto/create-category-response.dto';
import UpdateCategoryResponseDto from './dto/update-category-response.dto';
import DeleteCategoryResponseDto from './dto/delete-category-response.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  async create(@Body() createCategory: CreateCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<CreateCategoryResponseDto> {
    createCategory.image_url = file.filename;
    return this.categoryService.create(createCategory);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image_url'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategory: UpdateCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<UpdateCategoryResponseDto> {
    updateCategory.image_url = file.filename;
    return this.categoryService.update(id, updateCategory);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteCategoryResponseDto> {
    return this.categoryService.remove(id);
  }
}


