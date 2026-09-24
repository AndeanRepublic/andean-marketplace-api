import {
	IsString,
	IsNotEmpty,
	IsNumber,
	IsArray,
	IsOptional,
	IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityPageInfoDto {
	@ApiProperty({ description: 'Frase representativa de la comunidad', example: 'Guardianas del tejido andino' })
	@IsString()
	@IsNotEmpty()
	tagline: string;

	@ApiProperty({ description: 'Biografía corta de la comunidad', example: 'Somos una comunidad de 18 familias...' })
	@IsString()
	@IsNotEmpty()
	shortBio: string;

	@ApiProperty({ description: 'Número de familias', example: 18 })
	@IsNumber()
	familyCount: number;

	@ApiProperty({ description: 'Número de tejedores', example: 24 })
	@IsNumber()
	weaverCount: number;

	@ApiProperty({ description: 'Años de actividad', example: 3 })
	@IsNumber()
	activityYears: number;

	@ApiProperty({ description: 'IDs de imágenes de la sección de información (2 imágenes)', type: [String] })
	@IsArray()
	@IsString({ each: true })
	infoImageMediaIds: string[];

	@ApiProperty({ description: 'Descripción de "Lo que hacemos"', example: 'Creamos textiles usando técnicas ancestrales...' })
	@IsString()
	@IsNotEmpty()
	whatWeDoDescription: string;

	@ApiProperty({ description: 'IDs de imágenes de "Lo que hacemos" (2 imágenes)', type: [String] })
	@IsArray()
	@IsString({ each: true })
	whatWeDoImageMediaIds: string[];

	@ApiProperty({ description: 'IDs de fotos de galería', type: [String] })
	@IsArray()
	@IsString({ each: true })
	galleryPhotoMediaIds: string[];

	@ApiPropertyOptional({ description: 'ID del video de galería' })
	@IsOptional()
	@IsString()
	@IsMongoId()
	galleryVideoMediaId?: string;

	@ApiPropertyOptional({ description: 'ID del poster del video de galería' })
	@IsOptional()
	@IsString()
	@IsMongoId()
	galleryVideoPosterMediaId?: string;
}
