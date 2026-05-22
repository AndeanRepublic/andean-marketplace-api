import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShopStatus } from '../../../../domain/enums/ShopStatus';

export class UpdateShopStatusDto {
	@ApiProperty({ description: 'Estado del emprendimiento', enum: ShopStatus })
	@IsEnum(ShopStatus)
	@IsNotEmpty()
	status!: ShopStatus;
}
