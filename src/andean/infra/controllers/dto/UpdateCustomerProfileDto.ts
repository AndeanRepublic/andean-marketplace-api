import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { CoinType } from '../../../domain/enums/CoinType';

export class UpdateCustomerProfileDto {
	@IsString()
	@IsOptional()
	phoneNumber?: string;

	@IsDateString()
	@IsOptional()
	birthDate?: string;

	@IsString()
	@IsMongoId()
	@IsOptional()
	profilePictureMediaId?: string;

	@IsString()
	@IsOptional()
	country?: string;

	@IsString()
	@IsOptional()
	language?: string;

	@IsEnum(CoinType)
	@IsOptional()
	coin?: CoinType;
}
