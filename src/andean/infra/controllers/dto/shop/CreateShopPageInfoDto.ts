import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopPageInfoDto {
	@ApiProperty({ description: 'Frase representativa de la tienda', example: 'Guardianas del tejido andino' })
	@IsString()
	@IsNotEmpty()
	tagline: string;

	@ApiProperty({ description: 'Biografía corta de la tienda', example: 'Ada es maestra tejedora de Cuyo Chico...' })
	@IsString()
	@IsNotEmpty()
	shortBio: string;

	@ApiProperty({ description: 'IDs de imágenes de la sección de historia (2 imágenes)', type: [String] })
	@IsArray()
	@IsString({ each: true })
	historyImageMediaIds: string[];

	@ApiProperty({ description: 'Descripción de "Lo que hacemos"', example: 'Creamos piezas textiles únicas...' })
	@IsString()
	@IsNotEmpty()
	whatWeDoDescription: string;

	@ApiProperty({ description: 'IDs de imágenes de "Lo que hacemos" (2 imágenes)', type: [String] })
	@IsArray()
	@IsString({ each: true })
	whatWeDoImageMediaIds: string[];
}
