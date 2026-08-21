import { ApiProperty } from '@nestjs/swagger';
import { SellerCatalog } from '../../../domain/enums/SellerCatalog';
import { ShopCategory } from '../../../domain/enums/ShopCategory';

export class SellerWorkspaceShopResponse {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty({ enum: ShopCategory, isArray: true })
	categories!: ShopCategory[];
}

export class SellerWorkspaceResponse {
	@ApiProperty()
	sellerId!: string;

	@ApiProperty({ enum: SellerCatalog, isArray: true })
	catalogs!: SellerCatalog[];

	@ApiProperty({ type: [String] })
	shopIds!: string[];

	@ApiProperty({ type: [String] })
	communityIds!: string[];

	@ApiProperty({ type: [SellerWorkspaceShopResponse] })
	shops!: SellerWorkspaceShopResponse[];
}
