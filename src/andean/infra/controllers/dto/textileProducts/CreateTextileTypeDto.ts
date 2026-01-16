import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextileTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
