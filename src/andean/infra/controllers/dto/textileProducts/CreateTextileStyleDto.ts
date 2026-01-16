import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextileStyleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
