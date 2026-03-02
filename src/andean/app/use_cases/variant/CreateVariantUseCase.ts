import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';
import { CreateVariantDto } from '../../../infra/controllers/dto/variant/CreateVariantDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';

@Injectable()
export class CreateVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {}

	async execute(dto: CreateVariantDto): Promise<Variant> {
		const variant = VariantMapper.fromCreateDto(dto);
		return await this.variantRepository.create(variant);
	}
}
