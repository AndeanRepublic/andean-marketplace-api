import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { AccountStatus } from '../../../domain/enums/AccountStatus';
import { SellerStatus } from '../../../domain/enums/SellerStatus';

export class AdminAccountLookupResponse {
	@ApiProperty({ example: '507f1f77bcf86cd799439011' })
	id!: string;

	@ApiProperty({ example: 'María García' })
	name!: string;

	@ApiProperty({ example: 'maria@example.com' })
	email!: string;

	@ApiProperty({ enum: AccountStatus, example: AccountStatus.ENABLED })
	status!: AccountStatus;

	@ApiProperty({ enum: AccountRole, isArray: true, example: [AccountRole.USER] })
	roles!: AccountRole[];

	@ApiProperty({
		description: 'Si la cuenta ya tiene perfil de vendedor',
		example: false,
	})
	hasSellerProfile!: boolean;

	@ApiPropertyOptional({
		enum: SellerStatus,
		description: 'Estado del seller si hasSellerProfile es true',
	})
	sellerStatus?: SellerStatus;
}
