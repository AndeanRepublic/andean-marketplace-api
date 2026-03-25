import { ApiProperty } from '@nestjs/swagger';

export class TryOnResponse {
	@ApiProperty({
		description: 'Imagen resultante del try-on en formato base64',
		example: 'iVBORw0KGgoAAAANSUhEUgAA...',
	})
	image!: string;

	@ApiProperty({
		description: 'Formato de la imagen (siempre webp para segfit-v1.3)',
		example: 'image/webp',
	})
	mimeType!: string;
}
