import { Category } from "../entities/category.entity"

export default class CreateCategoryResponseDto {
    statusCode: number
    message: string
    data: Category
}