import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShopStatus } from '../../../../domain/enums/ShopStatus';

const SHOP_VISIBILITY_STATUSES = [ShopStatus.ACTIVE, ShopStatus.DEACTIVATED] as const;

export class UpdateShopVisibilityDto {
	@ApiProperty({
		description: 'Visibilidad de la tienda (solo ACTIVE o DEACTIVATED)',
		enum: SHOP_VISIBILITY_STATUSES,
	})
	@IsEnum(SHOP_VISIBILITY_STATUSES)
	@IsNotEmpty()
	status!: ShopStatus.ACTIVE | ShopStatus.DEACTIVATED;
}
