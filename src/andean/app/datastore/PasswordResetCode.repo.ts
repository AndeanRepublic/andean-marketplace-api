export interface PasswordResetCodeData {
	email: string;
	code: string;
	accountId: string;
	expiresAt: Date;
}

export interface PasswordResetCodeRecord {
	id: string;
	email: string;
	code: string;
	accountId: string;
	attempts: number;
	expiresAt: Date;
	usedAt: Date | null;
}

export abstract class PasswordResetCodeRepository {
	abstract create(data: PasswordResetCodeData): Promise<void>;
	abstract findByEmailAndCode(
		email: string,
		code: string,
	): Promise<PasswordResetCodeRecord | null>;
	abstract findByEmailActive(
		email: string,
	): Promise<PasswordResetCodeRecord | null>;
	abstract incrementAttempts(id: string): Promise<number>;
	abstract markAsUsed(email: string, code: string): Promise<void>;
}
