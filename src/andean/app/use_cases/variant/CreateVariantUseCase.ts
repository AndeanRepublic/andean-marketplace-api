import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { Variant } from '../../../domain/entities/Variant';
import { CreateVariantDto } from '../../../infra/controllers/dto/variant/CreateVariantDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';
import { ProductType } from '../../../domain/enums/ProductType';

@Injectable()
export class CreateVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) {}

	async execute(dto: CreateVariantDto): Promise<Variant> {
		const variant = VariantMapper.fromCreateDto(dto);
		const created = await this.variantRepository.create(variant);

		if (dto.productType === ProductType.TEXTILE && dto.stock > 0) {
			await this.textileProductRepository.adjustTotalStock(
				dto.productId,
				dto.stock,
			);
		}

		return created;
	}
}
