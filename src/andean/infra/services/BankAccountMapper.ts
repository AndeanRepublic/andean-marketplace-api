import { BankAccountDocument } from '../persistence/bankAccount.schema';
import { SellerBankAccount } from '../../domain/entities/SellerBankAccount';

export class BankAccountMapper {
  static fromDocument(doc: BankAccountDocument): SellerBankAccount {
    return new SellerBankAccount(
      doc.id,
      doc.sellerId,
      doc.status,
      doc.type,
      doc.cci,
      doc.bank,
    );
  }
}
