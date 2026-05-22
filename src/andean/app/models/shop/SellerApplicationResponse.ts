import { ApiProperty } from '@nestjs/swagger';
import { SellerProfileResponse } from '../users/SellerProfileResponse';
import { ShopResponse } from './ShopResponse';

export class SellerApplicationResponse {
	@ApiProperty({ type: SellerProfileResponse })
	seller!: SellerProfileResponse;

	@ApiProperty({ type: ShopResponse })
	shop!: ShopResponse;
}
