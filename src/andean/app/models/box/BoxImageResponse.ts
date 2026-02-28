import { ApiProperty } from '@nestjs/swagger';

export class BoxImageResponse {
	@ApiProperty({
		description: 'URL de la imagen',
		example: 'https://storage.example.com/images/box-thumbnail.webp',
	})
	url!: string;

	@ApiProperty({
		description: 'Nombre del archivo de imagen',
		example: 'box-thumbnail.webp',
	})
	name!: string;
}
