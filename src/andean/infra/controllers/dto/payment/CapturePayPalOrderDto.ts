import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CapturePayPalOrderDto {
	@ApiProperty({
		description: 'ID de la orden de PayPal',
		example: '5O190127TN364715T',
	})
	@IsString()
	@IsNotEmpty()
	orderId!: string;
}
