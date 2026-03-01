import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BankAccountType } from '../../../domain/enums/BankAccountType';

export class CreateBankAccountDto {
	@IsString()
	@IsNotEmpty()
	sellerId: string;

	@IsEnum(BankAccountType)
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	cci: string;

	@IsString()
	@IsNotEmpty()
	bank: string;
}
