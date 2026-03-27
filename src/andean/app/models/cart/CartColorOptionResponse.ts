import { ApiProperty } from '@nestjs/swagger';

/** Color de variante textil para carrito: nombre visible + hex del catálogo. */
export class CartColorOptionResponse {
	@ApiProperty({
		description: 'Nombre del color (p. ej. según alternativa)',
		example: 'Brown',
	})
	label!: string;

	@ApiProperty({
		description: 'Código hexadecimal del color para UI (swatch)',
		example: '#6B4423',
	})
	hexCode!: string;
}
