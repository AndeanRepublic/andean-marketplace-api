import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from 'src/andean/domain/enums/BookingStatus';

export class UpdateBookingDto {
	@ApiProperty({
		enum: BookingStatus,
		description: 'Nuevo estado del booking',
		example: BookingStatus.CONFIRMED,
	})
	@IsString()
	@IsEnum(BookingStatus)
	status!: string;
}
