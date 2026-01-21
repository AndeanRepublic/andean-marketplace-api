import { IsNotEmpty, IsString, MinLength, MaxLength, IsArray, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityDto {
	@ApiProperty({
		description: 'Nombre de la comunidad',
		example: 'Comunidad Artesanal de Cusco',
		minLength: 3,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(100)
	name: string;

	@ApiProperty({
		description: 'URL de la imagen banner de la comunidad',
		example: 'https://example.com/images/community-banner.jpg',
	})
	@IsString()
	@IsNotEmpty()
	@IsUrl()
	bannerImageUrl: string;

	@ApiPropertyOptional({
		description: 'Array de IDs de seals asociados a la comunidad',
		example: ['67890abcdef1234567890123', '67890abcdef1234567890124'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	seals?: string[];
}
