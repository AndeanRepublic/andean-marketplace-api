import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { CreateTextileProductDto } from './CreateTextileProductDto';

export class UpdateTextileProductDto extends CreateTextileProductDto {
	@ApiPropertyOptional({
		description:
			'Estado del producto: PUBLISHED, PENDING, SOLD_OUT, HIDDEN. Si no se envía, se mantiene el actual.',
		enum: TextileProductStatus,
	})
	@IsEnum(TextileProductStatus)
	@IsOptional()
	status?: TextileProductStatus;
}
