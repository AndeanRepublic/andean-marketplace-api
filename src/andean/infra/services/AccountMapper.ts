import { AccountDocument } from '../persistence/account.schema';
import { Account } from '../../domain/entities/Account';

export class AccountMapper {
	static fromDocument(doc: AccountDocument): Account {
		return new Account(
			doc._id.toString(),
			doc.name,
			doc.email,
			doc.password,
			doc.status,
			doc.type,
		);
	}
}
