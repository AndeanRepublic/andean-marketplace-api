import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TextileCategoryStatus } from 'src/andean/domain/enums/TextileCategoryStatus';

export class CreateTextileCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TextileCategoryStatus)
  @IsNotEmpty()
  status: TextileCategoryStatus;
}
