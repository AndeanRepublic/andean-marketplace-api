import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../../domain/enums/ProductType';

export class VariantResponse {
	@ApiProperty({
		description: 'ID único de la variante',
		example: '507f1f77bcf86cd799439011',
	})
	id: string;

	@ApiProperty({
		description: 'ID del producto al que pertenece esta variante',
		example: '507f1f77bcf86cd799439022',
	})
	productId: string;

	@ApiProperty({
		description: 'Tipo de producto al que pertenece la variante',
		enum: ProductType,
		example: ProductType.TEXTILE,
	})
	productType: ProductType;

	@ApiProperty({
		description: 'Combinación de opciones que define esta variante',
		example: { color: 'rojo', size: 'M' },
	})
	combination: Record<string, string>;

	@ApiProperty({
		description: 'Precio específico de esta variante',
		example: 165.0,
	})
	price: number;

	@ApiProperty({
		description: 'Stock disponible de esta variante',
		example: 10,
	})
	stock: number;

	@ApiProperty({
		description: 'Fecha de creación',
		example: '2024-01-01T00:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Fecha de última actualización',
		example: '2024-01-01T00:00:00.000Z',
	})
	updatedAt: Date;
}
