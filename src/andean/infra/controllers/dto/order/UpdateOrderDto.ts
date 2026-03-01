import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/andean/domain/enums/OrderStatus';

export class UpdateOrderDto {
	@ApiProperty({
		enum: OrderStatus,
		description: 'Nuevo estado de la orden',
		example: OrderStatus.SHIPPED,
	})
	@IsString()
	@IsEnum(OrderStatus)
	status: string;
}
