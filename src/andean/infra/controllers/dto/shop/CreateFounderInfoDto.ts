import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFounderInfoDto {
	@ApiProperty({ description: 'Nombre del fundador', example: 'Ada Marithza Dias Camala' })
	@IsString()
	@IsNotEmpty()
	founderName: string;

	@ApiProperty({ description: 'ID del MediaItem de la foto del fundador', example: '507f1f77bcf86cd799439044' })
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	founderImage: string;
}
