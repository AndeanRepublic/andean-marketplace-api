import { Injectable, NotFoundException } from '@nestjs/common';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';
import { DetailSourceProduct } from '../../../domain/entities/superfoods/DetailSourceProduct';
import { UpdateDetailSourceProductDto } from '../../../infra/controllers/dto/detailSourceProduct/UpdateDetailSourceProductDto';

@Injectable()
export class UpdateDetailSourceProductUseCase {
	constructor(
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) { }

	async handle(
		id: string,
		dto: UpdateDetailSourceProductDto,
	): Promise<DetailSourceProduct> {
		const existing = await this.detailSourceProductRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(
				`DetailSourceProduct with id ${id} not found`,
			);
		}

		const updatedData: Partial<DetailSourceProduct> = {
			...existing,
			...dto,
			updatedAt: new Date(),
		};

		return await this.detailSourceProductRepository.update(id, updatedData);
	}
}
