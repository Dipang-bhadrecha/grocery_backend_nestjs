import { Product } from "../entities/product.entity"

export default class CreateProductResponseDto {
    statusCode: number
    message: string
    data: Product
}