import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyDiscountCodeDto {
	@ApiProperty({
		description: 'Código de descuento generado por el juego',
		example: 'ABC123',
	})
	@IsString()
	@IsNotEmpty()
	code: string;
}
