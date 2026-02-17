import { Injectable, NotFoundException } from '@nestjs/common';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';

@Injectable()
export class DeleteDetailSourceProductUseCase {
	constructor(
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) { }

	async handle(id: string): Promise<void> {
		const existing = await this.detailSourceProductRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(
				`DetailSourceProduct with id ${id} not found`,
			);
		}

		await this.detailSourceProductRepository.delete(id);
	}
}
