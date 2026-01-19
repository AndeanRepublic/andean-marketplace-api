import { ApiProperty } from '@nestjs/swagger';

export class MediaItemResponse {
	@ApiProperty()
	id: string;

	@ApiProperty()
	type: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	url: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
