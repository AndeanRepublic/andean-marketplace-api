import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaItemDto {
	@ApiProperty({
		description:
			'Tipo/carpeta donde se almacenará el archivo (ej: products, avatars, banners)',
		example: 'products',
	})
	@IsString()
	@IsNotEmpty()
	type: string;

	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'quinoa-roja.png',
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}
