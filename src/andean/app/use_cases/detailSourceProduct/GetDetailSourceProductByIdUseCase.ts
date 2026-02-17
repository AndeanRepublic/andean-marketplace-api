import { Injectable, NotFoundException } from '@nestjs/common';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';
import { DetailSourceProduct } from '../../../domain/entities/superfoods/DetailSourceProduct';

@Injectable()
export class GetDetailSourceProductByIdUseCase {
	constructor(
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) { }

	async handle(id: string): Promise<DetailSourceProduct> {
		const detailSourceProduct =
			await this.detailSourceProductRepository.getById(id);

		if (!detailSourceProduct) {
			throw new NotFoundException(
				`DetailSourceProduct with id ${id} not found`,
			);
		}

		return detailSourceProduct;
	}
}
