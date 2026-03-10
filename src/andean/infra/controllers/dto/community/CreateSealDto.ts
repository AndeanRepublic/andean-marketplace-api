import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSealDto {
	@ApiProperty({
		description: 'Nombre del sello de comunidad',
		example: 'Artesanía Certificada',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Descripción del sello',
		example: 'Sello que certifica la autenticidad artesanal del producto.',
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({
		description: 'ID del media item del logo del sello',
		example: '507f1f77bcf86cd799439022',
	})
	@IsString()
	@IsNotEmpty()
	@IsMongoId()
	logoMediaId!: string;
}
