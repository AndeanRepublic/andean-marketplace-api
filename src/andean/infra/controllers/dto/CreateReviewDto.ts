import {
	IsString,
	IsNotEmpty,
	IsInt,
	IsEnum,
	IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { MediaItemType } from 'src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';

export class CreateReviewDto {
	@ApiProperty({
		description: 'Contenido textual de la reseña',
		example: 'Excelente producto, muy buena calidad.',
	})
	@IsString()
	@IsNotEmpty()
	content!: string;

	@ApiProperty({ description: 'Puntuación de 1 a 5 estrellas', example: 5 })
	@Transform(({ value }) => parseInt(value))
	@IsInt()
	@IsNotEmpty()
	numberStarts!: number;

	// Campos opcionales para subir media directamente
	@ApiPropertyOptional({
		description: 'Tipo de media adjunta',
		enum: MediaItemType,
		example: MediaItemType.IMG,
	})
	@IsEnum(MediaItemType)
	@IsOptional()
	mediaType?: MediaItemType;

	@ApiPropertyOptional({
		description: 'Nombre del archivo de media',
		example: 'foto-review.jpg',
	})
	@IsString()
	@IsOptional()
	mediaName?: string;

	@ApiPropertyOptional({
		description: 'Rol del media item en la reseña',
		enum: MediaItemRole,
		example: MediaItemRole.SECUNDARY,
	})
	@IsEnum(MediaItemRole)
	@IsOptional()
	mediaRole?: MediaItemRole;

	@ApiProperty({
		description: 'ID del cliente que realiza la reseña',
		example: '507f1f77bcf86cd799439022',
	})
	@IsString()
	@IsNotEmpty()
	customerId!: string;

	@ApiProperty({
		description: 'ID del producto reseñado',
		example: '507f1f77bcf86cd799439033',
	})
	@IsString()
	@IsNotEmpty()
	productId!: string;

	@ApiProperty({
		description: 'Tipo de producto reseñado',
		enum: ProductType,
		example: ProductType.TEXTILE,
	})
	@IsEnum(ProductType)
	@IsNotEmpty()
	productType!: ProductType;
}
