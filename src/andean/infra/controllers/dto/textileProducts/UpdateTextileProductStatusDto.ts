import { IsEnum, IsNotEmpty } from 'class-validator';
import { TextileProductStatus } from '../../../../domain/enums/TextileProductStatus';

export class UpdateTextileProductStatusDto {
	@IsEnum(TextileProductStatus)
	@IsNotEmpty()
	status: TextileProductStatus;
}
