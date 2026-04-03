import { ApiProperty } from '@nestjs/swagger';

export class SuperfoodColorResponse {
	@ApiProperty({ description: 'ID único del color' })
	id!: string;

	@ApiProperty({ description: 'Nombre del color', example: 'Morado' })
	name!: string;

	@ApiProperty({ description: 'Código hexadecimal', example: '#7c3aed' })
	hexCodeColor!: string;

	@ApiProperty({ description: 'Fecha de creación' })
	createdAt!: Date;

	@ApiProperty({ description: 'Fecha de última actualización' })
	updatedAt!: Date;
}
