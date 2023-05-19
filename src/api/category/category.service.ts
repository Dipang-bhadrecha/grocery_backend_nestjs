import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORYNAME_ALREADY_USED_MESSAGE, CATEGORY_CREATED_MESSAGE, CATEGORY_DELETED_MESSAGE, CATEGORY_NOTFOUND_MESSAGE, CATEGORY_UPDATED_MESSAGE } from './constraints/constraints';
import CreateCategoryResponseDto from './dto/create-category-response.dto';
import UpdateCategoryResponseDto from './dto/update-category-response.dto';
import DeleteCategoryResponseDto from './dto/delete-category-response.dto';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }

  // create a category
  async create(createCategory: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
    try {
      const count = await this.isCategoryExits(createCategory.name, null);

      if (count !== 0) {
        throw new HttpException(CATEGORYNAME_ALREADY_USED_MESSAGE, HttpStatus.NOT_ACCEPTABLE)
      }

      const category = new Category();
      category.name = createCategory.name;
      category.image_url = createCategory.image_url;
      const result = await this.categoryRepository.save(category);
      return {
        statusCode: 201,
        message: CATEGORY_CREATED_MESSAGE,
        data: result
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // category name is exits or not 
  async isCategoryExits(name: string, id: number): Promise<number> {
    try {
      const query = await this.categoryRepository.createQueryBuilder('category');
      if (id == null) {
        const count = await query.where('category.name =:name', { name }).getCount();
        return count;
      }
      const count = await query.where('category.id != :id', { id }).andWhere('category.name =:name', { name }).getCount();
      return count;

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }


  // update category by id
  async update(id: number, updateCategory: UpdateCategoryDto): Promise<UpdateCategoryResponseDto> {
    try {

      const categoryFound = await this.categoryRepository.count({ where: { id } });
      if (categoryFound == 0) {
        throw new NotFoundException(CATEGORY_NOTFOUND_MESSAGE)
      }

      const isExitsCategory = await this.isCategoryExits(updateCategory.name, id);
      if (isExitsCategory != 0) {
        throw new HttpException(CATEGORYNAME_ALREADY_USED_MESSAGE, HttpStatus.NOT_ACCEPTABLE)
      }

      const category = new Category();
      category.name = updateCategory.name;
      category.image_url = updateCategory.image_url;
      category.is_active = updateCategory.is_active;

      const result = await this.categoryRepository.update(id, category);
      if (result.affected > 0) {
        return {
          statusCode: 201,
          message: CATEGORY_UPDATED_MESSAGE
        }
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //delete category by id
  async remove(id: number): Promise<DeleteCategoryResponseDto> {
    try {
      const categoryFound = await this.categoryRepository.count({ where: { id } });
      if (categoryFound == 0) {
        throw new HttpException(CATEGORY_NOTFOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }

      await this.categoryRepository.delete(id);
      return {
        statusCode: 201,
        message: CATEGORY_DELETED_MESSAGE
      }
    } catch (error) {

      console.log(error);

      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

