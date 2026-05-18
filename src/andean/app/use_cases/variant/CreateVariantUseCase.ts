import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';
import { CreateVariantDto } from '../../../infra/controllers/dto/variant/CreateVariantDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';
import { ProductType } from '../../../domain/enums/ProductType';
import { TextileProductStockFromVariantsSync } from '../../../infra/services/textileProducts/TextileProductStockFromVariantsSync';

@Injectable()
export class CreateVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		private readonly textileProductStockFromVariantsSync: TextileProductStockFromVariantsSync,
	) {}

	async execute(dto: CreateVariantDto): Promise<Variant> {
		const variant = VariantMapper.fromCreateDto(dto);
		const created = await this.variantRepository.create(variant);

		if (dto.productType === ProductType.TEXTILE) {
			await this.textileProductStockFromVariantsSync.apply(dto.productId);
		}

		return created;
	}
}
