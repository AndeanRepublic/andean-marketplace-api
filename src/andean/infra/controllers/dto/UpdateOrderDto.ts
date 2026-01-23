import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../../../domain/enums/OrderStatus';

export class UpdateOrderDto {
	@IsString()
	@IsEnum(OrderStatus)
	status: string;
}
