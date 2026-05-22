import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkShopToSellerDto {
	@ApiProperty({
		description: 'ID del perfil de vendedor (SellerProfile._id)',
		example: '507f1f77bcf86cd799439012',
	})
	@IsString()
	@IsNotEmpty()
	sellerId!: string;
}
