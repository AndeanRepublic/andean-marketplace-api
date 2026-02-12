import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoxSealDto {
	@ApiProperty({ description: 'Nombre del sello', example: 'Comercio Justo' })
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ description: 'Descripción del sello', example: 'Certificación que garantiza condiciones laborales dignas y precios justos para los productores.' })
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiProperty({ description: 'ID del media item del logo del sello', example: '6973d8ffddef7b59c2d4dcff' })
	@IsString()
	@IsNotEmpty()
	logoMediaId!: string;
}
