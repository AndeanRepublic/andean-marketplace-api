import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
