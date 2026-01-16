import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextilePrincipalUseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
