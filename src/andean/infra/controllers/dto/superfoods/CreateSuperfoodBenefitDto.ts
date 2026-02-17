import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SuperfoodColor } from '../../../../domain/enums/SuperfoodColor';

export class CreateSuperfoodBenefitDto {
	@ApiProperty({
		description: 'Nombre del beneficio',
		example: 'Mejora la digestión',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: 'Descripción detallada del beneficio',
		example: 'Este beneficio ayuda a mejorar la digestión gracias a sus propiedades naturales y alto contenido de fibra.',
		minLength: 10,
		maxLength: 500,
	})
	@IsString()
	@IsNotEmpty()
	description!: string;

	@ApiPropertyOptional({
		description: 'Color asociado al beneficio',
		enum: SuperfoodColor,
		example: SuperfoodColor.GREEN,
	})
	@IsEnum(SuperfoodColor)
	@IsOptional()
	color?: SuperfoodColor;

	@ApiProperty({
		description: 'ID del MediaItem que representa el icono del beneficio',
		example: '123e4567-e89b-12d3-a456-426614174000',
		required: false,
	})
	@IsString()
	@IsMongoId()
	@IsOptional()
	iconId?: string;
}
