import { IsEnum, IsNotEmpty } from 'class-validator';
import { SuperfoodProductStatus } from '../../../../domain/enums/SuperfoodProductStatus';

export class UpdateSuperfoodStatusDto {
	@IsEnum(SuperfoodProductStatus)
	@IsNotEmpty()
	status: SuperfoodProductStatus;
}
