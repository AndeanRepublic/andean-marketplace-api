import { Injectable } from '@nestjs/common';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';

@Injectable()
export class DeleteBoxSealUseCase {
	constructor(private readonly boxSealRepository: BoxSealRepository) { }

	async handle(id: string): Promise<void> {
		return this.boxSealRepository.delete(id);
	}
}
