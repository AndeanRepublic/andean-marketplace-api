import { IsString, IsNotEmpty } from 'class-validator';

export class CreateColorOptionAlternativeDto {
	@IsString()
	@IsNotEmpty()
	nameLabel: string;

	@IsString()
	@IsNotEmpty()
	hexCode: string;
}
