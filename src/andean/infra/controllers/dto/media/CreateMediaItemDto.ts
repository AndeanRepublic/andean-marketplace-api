import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaItemDto {
	@ApiProperty({
		description: 'Tipo de medio (image, video, etc.)',
		example: 'image'
	})
	@IsString()
	@IsNotEmpty()
	type: string;

	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'product-icon.png'
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'URL del archivo',
		example: 'https://example.com/uploads/product-icon.png'
	})
	@IsUrl()
	@IsNotEmpty()
	url: string;
}
