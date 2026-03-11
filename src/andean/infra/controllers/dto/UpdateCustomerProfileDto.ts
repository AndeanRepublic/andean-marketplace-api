import {
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CoinType } from '../../../domain/enums/CoinType';

export class UpdateCustomerProfileDto {
	@ApiPropertyOptional({
		description: 'Número de teléfono del cliente',
		example: '+51987654321',
	})
	@IsString()
	@IsOptional()
	phoneNumber?: string;

	@ApiPropertyOptional({
		description: 'Fecha de nacimiento del cliente',
		example: '1990-05-15',
	})
	@IsDateString()
	@IsOptional()
	birthDate?: string;

	@ApiPropertyOptional({
		description: 'ID del media item para la foto de perfil',
		example: '64b1f2c3d4e5f6a7b8c9d0e1',
	})
	@IsString()
	@IsMongoId()
	@IsOptional()
	profilePictureMediaId?: string;

	@ApiPropertyOptional({ description: 'País del cliente', example: 'Peru' })
	@IsString()
	@IsOptional()
	country?: string;

	@ApiPropertyOptional({
		description: 'Idioma preferido del cliente',
		example: 'es',
	})
	@IsString()
	@IsOptional()
	language?: string;

	@ApiPropertyOptional({
		description: 'Moneda preferida del cliente',
		enum: CoinType,
		example: CoinType.USD,
	})
	@IsEnum(CoinType)
	@IsOptional()
	coin?: CoinType;
}
