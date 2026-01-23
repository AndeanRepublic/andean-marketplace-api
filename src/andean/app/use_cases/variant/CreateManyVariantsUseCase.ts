import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';
import { CreateManyVariantsDto } from '../../../infra/controllers/dto/variant/CreateManyVariantsDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';

@Injectable()
export class CreateManyVariantsUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {}

	async execute(dto: CreateManyVariantsDto): Promise<Variant[]> {
		const variants = dto.variants.map((variantDto) =>
			VariantMapper.fromCreateDto(variantDto),
		);
		return await this.variantRepository.createMany(variants);
	}
}
