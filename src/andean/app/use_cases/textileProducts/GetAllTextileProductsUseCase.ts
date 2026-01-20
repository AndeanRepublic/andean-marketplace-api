import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { PaginatedProductsResponse } from '../../modules/PaginatedProductsResponse';

@Injectable()
export class GetAllTextileProductsUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) { }

	async handle(page?: number, perPage?: number): Promise<PaginatedProductsResponse<TextileProduct>> {
		// Si no se envían parámetros de paginación, retornar todos con formato paginado
		if (!page || !perPage) {
			const products = await this.textileProductRepository.getAllTextileProducts();
			if (products.length === 0) {
				throw new NotFoundException('No textile products found');
			}

			const total = products.length;
			return {
				products,
				pagination: {
					total,
					page: 1,
					per_page: total, // per_page igual al total
				},
			};
		}

		// Con paginación
		const { products, total } = await this.textileProductRepository.getAllWithPagination(page, perPage);

		return {
			products,
			pagination: {
				total,
				page,
				per_page: perPage,
			},
		};
	}
}
