import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateSealDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	description!: string;

	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	logoMediaId!: string;
}
