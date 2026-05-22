import { ApiProperty } from '@nestjs/swagger';
import { SellerProfileResponse } from '../users/SellerProfileResponse';
import { ShopResponse } from './ShopResponse';

export class LinkShopToSellerResponse {
	@ApiProperty({ type: ShopResponse })
	shop!: ShopResponse;

	@ApiProperty({ type: SellerProfileResponse })
	seller!: SellerProfileResponse;
}
