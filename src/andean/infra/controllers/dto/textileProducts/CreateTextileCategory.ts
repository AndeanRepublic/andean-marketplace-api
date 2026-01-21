import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TextileCategoryStatus } from 'src/andean/domain/enums/TextileCategoryStatus';

export class CreateTextileCategoryDto {
	@ApiProperty({
		description: 'Nombre de la categoría textil',
		example: 'Ponchos',
		minLength: 2,
		maxLength: 100,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Estado de la categoría textil',
		enum: TextileCategoryStatus,
		example: TextileCategoryStatus.ENABLED,
	})
	@IsEnum(TextileCategoryStatus)
	@IsNotEmpty()
	status: TextileCategoryStatus;
}
