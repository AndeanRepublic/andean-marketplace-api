import {
	IsNotEmpty,
	IsString,
	IsUrl,
	IsEnum,
	IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaItemType } from '../../../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../../../domain/enums/MediaItemRole';

export class CreateMediaItemDto {
	@ApiProperty({
		description: 'Tipo de media item',
		enum: MediaItemType,
		example: MediaItemType.IMG,
	})
	@IsEnum(MediaItemType)
	@IsNotEmpty()
	type!: MediaItemType;

	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'product-icon.png',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'URL del archivo',
		example: 'https://example.com/uploads/product-icon.png',
	})
	@IsUrl()
	@IsNotEmpty()
	url!: string;

	@ApiProperty({
		description: 'Rol del media item',
		enum: MediaItemRole,
		example: MediaItemRole.PRINCIPAL,
		required: false,
	})
	@IsEnum(MediaItemRole)
	@IsOptional()
	role?: MediaItemRole;
}
