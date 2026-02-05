import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaItemType } from '../../../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../../../domain/enums/MediaItemRole';

export class UploadMediaItemDto {
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
		example: 'quinoa-roja.png',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

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
