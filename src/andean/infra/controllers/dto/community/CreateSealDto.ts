import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSealDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	logoUrl: string;
}
