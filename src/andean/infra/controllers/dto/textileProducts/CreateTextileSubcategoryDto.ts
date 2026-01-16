import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextileSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
