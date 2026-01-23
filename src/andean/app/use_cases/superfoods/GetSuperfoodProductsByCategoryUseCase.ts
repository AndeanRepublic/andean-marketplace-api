import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';

@Injectable()
export class GetSuperfoodProductsByCategoryUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,

		@Inject(SuperfoodCategoryRepository)
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) {}

	async handle(categoryId: string): Promise<SuperfoodProduct[]> {
		// Validar que la categoría existe
		const categoryFound =
			await this.categoryRepository.getCategoryById(categoryId);
		if (!categoryFound) {
			throw new NotFoundException(
				`Categoría con ID ${categoryId} no encontrada`,
			);
		}

		return this.superfoodProductRepository.getAllByCategoryId(categoryId);
	}
}
