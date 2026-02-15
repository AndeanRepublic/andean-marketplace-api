import { Injectable } from '@nestjs/common';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';
import { DetailSourceProduct } from '../../../domain/entities/superfoods/DetailSourceProduct';

@Injectable()
export class GetAllDetailSourceProductsUseCase {
	constructor(
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) { }

	async handle(): Promise<DetailSourceProduct[]> {
		return await this.detailSourceProductRepository.getAll();
	}
}
