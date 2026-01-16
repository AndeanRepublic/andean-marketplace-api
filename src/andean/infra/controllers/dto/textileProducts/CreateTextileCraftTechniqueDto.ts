import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTextileCraftTechniqueDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
