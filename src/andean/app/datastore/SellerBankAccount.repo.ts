import { SellerBankAccount } from '../../domain/entities/SellerBankAccount';

export abstract class SellerBankAccountRepository {
	abstract saveBankAccount(
		bankAccount: SellerBankAccount,
	): Promise<SellerBankAccount>;
	abstract getBankAccountById(id: string): Promise<SellerBankAccount | null>;
	abstract getBankAccountsBySellerId(
		sellerId: string,
	): Promise<SellerBankAccount[]>;
	abstract deleteBankAccount(id: string): Promise<void>;
}
