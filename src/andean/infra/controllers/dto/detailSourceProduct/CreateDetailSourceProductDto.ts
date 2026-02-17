import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetailSourceProductDto {
	@ApiProperty({
		description: 'Nombre del detalle de origen del producto',
		example: 'Origen Andino Premium',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Descripción del detalle de origen del producto',
		example:
			'Producto cultivado en las altas montañas de los Andes peruanos',
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({
		description: 'Lista de características del origen del producto',
		example: [
			'Cultivo orgánico certificado',
			'Cosecha manual',
			'Proceso tradicional',
		],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	features!: string[];
}
