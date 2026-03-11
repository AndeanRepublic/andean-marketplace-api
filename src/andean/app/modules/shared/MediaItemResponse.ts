import { ApiProperty } from '@nestjs/swagger';
import { MediaItemType } from '../../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../../domain/enums/MediaItemRole';

export class MediaItemResponse {
	@ApiProperty()
	id!: string;

	@ApiProperty({ enum: MediaItemType, description: 'Tipo de media item' })
	type!: MediaItemType;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	url!: string;

	@ApiProperty({ enum: MediaItemRole, description: 'Rol del media item' })
	role!: MediaItemRole;

	@ApiProperty()
	createdAt!: Date;

	@ApiProperty()
	updatedAt!: Date;
}
