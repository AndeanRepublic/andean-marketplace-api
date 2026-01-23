import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
	async hash(password: string): Promise<string> {
		return argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16,
			timeCost: 3,
			parallelism: 1,
		});
	}

	async verify(hash: string, password: string): Promise<boolean> {
		try {
			return argon2.verify(hash, password);
		} catch {
			return false;
		}
	}
}
