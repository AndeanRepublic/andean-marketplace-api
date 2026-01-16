import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextileCertificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
