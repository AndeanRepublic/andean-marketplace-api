import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSuperfoodProductMediaDto {
	@ApiProperty({
		description: 'ID MediaItem — imagen del paquete (principal)',
		example: '507f1f77bcf86cd799439011',
	})
	@IsString()
	@IsNotEmpty()
	mainImgId!: string;

	@ApiPropertyOptional({
		description: 'ID MediaItem — imagen del plato',
	})
	@IsString()
	@IsOptional()
	plateImgId?: string;

	@ApiPropertyOptional({
		description: 'ID MediaItem — imagen del producto fuente',
	})
	@IsString()
	@IsOptional()
	sourceProductImgId?: string;

	@ApiPropertyOptional({
		description: 'ID MediaItem — imagen más cercana del producto fuente',
	})
	@IsString()
	@IsOptional()
	closestSourceProductImgId?: string;

	@ApiPropertyOptional({
		description: 'IDs de otras imágenes relacionadas',
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	otherImagesId?: string[];
}
