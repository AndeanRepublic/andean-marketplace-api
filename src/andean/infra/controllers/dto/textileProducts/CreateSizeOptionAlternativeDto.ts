import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSizeOptionAlternativeDto {
	@IsString()
	@IsNotEmpty()
	nameLabel: string;
}
