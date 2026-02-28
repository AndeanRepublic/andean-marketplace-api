import { Injectable } from '@nestjs/common';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';

@Injectable()
export class GetAllBoxSealsUseCase {
	constructor(private readonly boxSealRepository: BoxSealRepository) {}

	async handle(): Promise<BoxSeal[]> {
		return this.boxSealRepository.getAll();
	}
}
