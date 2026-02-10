import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBoxSealDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	description!: string;

	@IsString()
	@IsNotEmpty()
	logoMediaId!: string;
}
