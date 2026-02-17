import { Injectable } from '@nestjs/common';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';
import { DetailSourceProduct } from '../../../domain/entities/superfoods/DetailSourceProduct';
import { CreateDetailSourceProductDto } from '../../../infra/controllers/dto/detailSourceProduct/CreateDetailSourceProductDto';
import { DetailSourceProductMapper } from '../../../infra/services/superfood/DetailSourceProductMapper';

@Injectable()
export class CreateDetailSourceProductUseCase {
	constructor(
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) { }

	async handle(
		dto: CreateDetailSourceProductDto,
	): Promise<DetailSourceProduct> {
		const detailSourceProduct =
			DetailSourceProductMapper.fromCreateDto(dto);
		return await this.detailSourceProductRepository.create(
			detailSourceProduct,
		);
	}
}
