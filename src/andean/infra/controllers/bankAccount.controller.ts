import { Controller } from '@nestjs/common';
import { GetBankAccountByIdUseCase } from '../../app/use_cases/bank_accounts/GetBankAccountByIdUseCase';
import { GetBankAccountsBySellerUseCase } from '../../app/use_cases/bank_accounts/GetBankAccountsBySellerUseCase';
import { CreateBankAccountUseCase } from '../../app/use_cases/bank_accounts/CreateBankAccountUseCase';
import { DeleteBankAccountUseCase } from '../../app/use_cases/bank_accounts/DeleteBankAccountUseCase';

@Controller('bank-accounts')
export class BankAccountController {
	constructor(
		private readonly getBankAccountByIdUseCase: GetBankAccountByIdUseCase,
		private readonly getBankAccountsBySellerUseCase: GetBankAccountsBySellerUseCase,
		private readonly createBankAccountUseCase: CreateBankAccountUseCase,
		private readonly deleteBankAccountUseCase: DeleteBankAccountUseCase,
	) {}

	// @Post('')
	// async createBankAccount(
	// 	@Body() body: CreateBankAccountDto,
	// ): Promise<SellerBankAccount> {
	// 	return this.createBankAccountUseCase.handle(body);
	// }

	// @Get('/:accountId')
	// async getById(
	// 	@Param('accountId') accountId: string,
	// ): Promise<SellerBankAccount> {
	// 	return this.getBankAccountByIdUseCase.handle(accountId);
	// }

	// @Get('/by-seller/:sellerId')
	// async getBySellerId(
	// 	@Param('sellerId') sellerId: string,
	// ): Promise<SellerBankAccount[]> {
	// 	return this.getBankAccountsBySellerUseCase.handle(sellerId);
	// }

	// @Delete('/:accountId')
	// async deleteBankAccount(
	// 	@Param('accountId') accountId: string,
	// ): Promise<void> {
	// 	return this.deleteBankAccountUseCase.handle(accountId);
	// }
}
