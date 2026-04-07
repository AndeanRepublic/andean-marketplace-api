import { IsEnum, IsNotEmpty } from 'class-validator';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export class UpdateEntityStatusDto {
	@IsEnum(AdminEntityStatus)
	@IsNotEmpty()
	status: AdminEntityStatus;
}
