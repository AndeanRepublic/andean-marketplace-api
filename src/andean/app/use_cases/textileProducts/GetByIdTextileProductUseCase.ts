import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';

@Injectable()
export class GetByIdTextileProductUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) {}

	async handle(id: string): Promise<TextileProduct> {
		const productFound =
			await this.textileProductRepository.getTextileProductById(id);
		if (!productFound) {
			throw new NotFoundException('Textile product not found');
		}
		return productFound;
	}
}
