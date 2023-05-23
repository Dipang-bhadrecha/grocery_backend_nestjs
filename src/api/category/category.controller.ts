import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ROLE } from 'src/helpers/role.enum';
import { AuthGuard } from '@nestjs/passport';
import CreateResponseDto from 'src/utils/create-respons.dto';
import DeleteResponseDto from 'src/utils/delete-response.dto';
import UpdateResponseDto from 'src/utils/update-response.dto';


@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Post('/create')
  @UseInterceptors(FileInterceptor('image_url'))
  async create(@Body() createCategory: CreateCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<CreateResponseDto> {
    createCategory.image_url = file.filename;
    return this.categoryService.create(createCategory);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image_url'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategory: UpdateCategoryDto, @UploadedFile() file: Express.Multer.File): Promise<UpdateResponseDto> {
    updateCategory.image_url = file.filename;
    return this.categoryService.update(id, updateCategory);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLE.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    return this.categoryService.remove(id);
  }
}


