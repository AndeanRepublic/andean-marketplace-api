import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TryOnDto {
	@ApiProperty({
		description: 'ID del MediaItem que representa la prenda a probar',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	mediaItemId!: string;

	@ApiPropertyOptional({
		description:
			'Descripción de la prenda (ayuda al modelo a generar mejor resultado)',
		example: 'Green colour semi Formal Blazer',
	})
	@IsString()
	@IsOptional()
	garmentDescription?: string;
}
