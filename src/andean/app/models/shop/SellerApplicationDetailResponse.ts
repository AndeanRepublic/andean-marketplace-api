import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SellerProfileResponse } from '../users/SellerProfileResponse';
import { ShopCategory } from '../../../domain/enums/ShopCategory';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

export class SellerApplicationAccountInfo {
	@ApiProperty({ example: 'usuario@ejemplo.com' })
	email!: string;

	@ApiProperty({ example: 'Juan Pérez' })
	name!: string;
}

export class SellerApplicationSealInfo {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;
}

export class SellerApplicationShopDetail {
	@ApiProperty()
	id!: string;

	@ApiPropertyOptional()
	sellerId?: string;

	@ApiProperty()
	name!: string;

	@ApiProperty({ enum: ShopStatus })
	status!: ShopStatus;

	@ApiProperty({ enum: ShopCategory, isArray: true })
	categories!: ShopCategory[];

	@ApiPropertyOptional()
	artisanPhotoMediaId?: string;

	@ApiPropertyOptional()
	artisanPhotoUrl?: string;

	@ApiPropertyOptional({
		description: 'ID del registro ProviderInfo vinculado a la tienda (Shop.providerInfoId)',
	})
	providerInfoId?: string;

	@ApiPropertyOptional({ type: [SellerApplicationSealInfo] })
	seals?: SellerApplicationSealInfo[];

	@ApiPropertyOptional({ type: 'object', additionalProperties: true })
	providerInfo?: Record<string, unknown>;
}

export class SellerApplicationDetailResponse {
	@ApiProperty({ type: SellerProfileResponse })
	seller!: SellerProfileResponse;

	@ApiProperty({ type: SellerApplicationAccountInfo })
	account!: SellerApplicationAccountInfo;

	@ApiProperty({ type: [SellerApplicationShopDetail] })
	shops!: SellerApplicationShopDetail[];
}
