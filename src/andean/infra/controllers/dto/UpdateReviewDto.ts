import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from 'src/andean/domain/enums/ProductType';

export class UpdateReviewDto {
	@ApiPropertyOptional({
		description: 'Contenido textual de la reseña',
		example: 'Actualizo mi reseña: producto de excelente calidad.',
	})
	@IsString()
	@IsOptional()
	content?: string;

	@ApiPropertyOptional({
		description: 'Nueva puntuación de 1 a 5 estrellas',
		example: 4,
	})
	@Transform(({ value }) => (value ? parseInt(value) : value))
	@IsInt()
	@IsOptional()
	numberStars?: number;

	@ApiPropertyOptional({
		description: 'ID de la cuenta del usuario',
		example: '507f1f77bcf86cd799439022',
	})
	@IsString()
	@IsOptional()
	accountId?: string;

	@ApiPropertyOptional({
		description: 'ID del producto',
		example: '507f1f77bcf86cd799439033',
	})
	@IsString()
	@IsOptional()
	productId?: string;

	@ApiPropertyOptional({
		description: 'Tipo de producto',
		enum: ProductType,
		example: ProductType.TEXTILE,
	})
	@IsEnum(ProductType)
	@IsOptional()
	productType?: ProductType;
}
