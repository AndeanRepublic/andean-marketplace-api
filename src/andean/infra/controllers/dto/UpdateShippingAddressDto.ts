import { CreateShippingAddressDto } from './CreateShippingAddressDto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateShippingAddressDto extends PartialType(
	CreateShippingAddressDto,
) {
	@ApiPropertyOptional({
		description: 'Marcar como dirección por defecto',
	})
	@IsBoolean()
	@IsOptional()
	isDefault?: boolean;
}
