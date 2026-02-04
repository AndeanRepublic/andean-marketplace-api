import {
	IsString,
	IsNotEmpty,
	IsOptional,
	IsBoolean,
	IsObject,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdministrativeArea } from 'src/andean/domain/entities/order/Order';

export class AdministrativeAreaDto implements AdministrativeArea {
	@ApiPropertyOptional({ description: 'Level 1 (state/province/department)' })
	@IsString()
	@IsOptional()
	level1?: string;

	@ApiPropertyOptional({ description: 'Level 2' })
	@IsString()
	@IsOptional()
	level2?: string;

	@ApiPropertyOptional({ description: 'Level 3' })
	@IsString()
	@IsOptional()
	level3?: string;
}

export class CreateShippingAddressDto {
	@ApiProperty({ description: 'Nombre del destinatario' })
	@IsString()
	@IsNotEmpty()
	recipientName: string;

	@ApiProperty({ description: 'Teléfono del destinatario' })
	@IsString()
	@IsNotEmpty()
	phone: string;

	@ApiProperty({ description: 'Código de país (PE, US, CA, etc)', example: 'PE' })
	@IsString()
	@IsNotEmpty()
	countryCode: string;

	@ApiProperty({ description: 'Nombre del país' })
	@IsString()
	@IsNotEmpty()
	country: string;

	@ApiProperty({ description: 'Ciudad' })
	@IsString()
	@IsNotEmpty()
	city: string;

	@ApiProperty({ type: AdministrativeAreaDto })
	@ValidateNested()
	@Type(() => AdministrativeAreaDto)
	@IsObject()
	administrativeArea: AdministrativeAreaDto;

	@ApiProperty({ description: 'Dirección línea 1' })
	@IsString()
	@IsNotEmpty()
	addressLine1: string;

	@ApiPropertyOptional({ description: 'Dirección línea 2' })
	@IsString()
	@IsOptional()
	addressLine2?: string;

	@ApiPropertyOptional({ description: 'Código postal' })
	@IsString()
	@IsOptional()
	postalCode?: string;

	@ApiPropertyOptional({
		description: 'Marcar como dirección por defecto',
		default: false,
	})
	@IsBoolean()
	@IsOptional()
	isDefault?: boolean;
}
