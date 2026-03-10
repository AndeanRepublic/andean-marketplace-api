import { ApiProperty } from '@nestjs/swagger';

export class BookingErrorResponse {
	@ApiProperty({ description: 'Código de estado HTTP', example: 404 })
	statusCode!: number;

	@ApiProperty({
		description: 'Mensaje de error',
		example: 'Booking no encontrado',
	})
	message!: string | string[];

	@ApiProperty({ description: 'Tipo de error', example: 'Not Found' })
	error!: string;
}
