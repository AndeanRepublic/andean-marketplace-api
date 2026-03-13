import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TryOnDto {
	@ApiProperty({
		description: 'ID del producto textil a probar virtualmente',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	textileProductId!: string;
}
