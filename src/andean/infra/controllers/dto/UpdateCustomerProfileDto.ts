import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CoinType } from '../../../domain/enums/CoinType';

export class UpdateCustomerProfileDto {
	@IsString()
	@IsNotEmpty()
	phoneNumber!: string;

	@IsString()
	@IsNotEmpty()
	birthDate!: string;

	@IsString()
	@IsMongoId()
	@IsOptional()
	profilePictureMediaId?: string;

	@IsString()
	@IsNotEmpty()
	country!: string;

	@IsString()
	@IsNotEmpty()
	language!: string;

	@IsEnum(CoinType)
	@IsNotEmpty()
	coin!: CoinType;
}
