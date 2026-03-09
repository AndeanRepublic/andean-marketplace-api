import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '../../domain/enums/ProductType';

export class ReviewResponse {
	@ApiProperty({
		description: 'ID único de la reseña',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'Contenido textual de la reseña',
		example: 'Excelente producto, muy buena calidad de tejido andino.',
	})
	content: string;

	@ApiProperty({
		description: 'Puntuación de la reseña (1 a 5 estrellas)',
		example: 5,
	})
	numberStarts: number;

	@ApiProperty({
		description: 'ID del cliente que realizó la reseña',
		example: '507f1f77bcf86cd799439022',
	})
	customerId: string;

	@ApiProperty({
		description: 'ID del producto reseñado',
		example: '507f1f77bcf86cd799439033',
	})
	productId: string;

	@ApiProperty({
		description: 'Tipo de producto reseñado',
		enum: ProductType,
		example: ProductType.TEXTILE,
	})
	productType: ProductType;

	@ApiProperty({
		description: 'Número de likes recibidos',
		example: 12,
	})
	numberLikes: number;

	@ApiProperty({
		description: 'Número de dislikes recibidos',
		example: 1,
	})
	numberDislikes: number;

	@ApiProperty({
		description: 'Fecha de creación de la reseña',
		example: '2024-01-01T00:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Fecha de última actualización',
		example: '2024-01-01T00:00:00.000Z',
	})
	updatedAt: Date;

	@ApiPropertyOptional({
		description: 'ID del media item adjunto a la reseña (imagen)',
		example: '507f1f77bcf86cd799439044',
	})
	mediaId?: string;
}
