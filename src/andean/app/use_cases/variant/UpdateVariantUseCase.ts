import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';
import { UpdateVariantDto } from '../../../infra/controllers/dto/variant/UpdateVariantDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';

@Injectable()
export class UpdateVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {}

	async execute(id: string, dto: UpdateVariantDto): Promise<Variant> {
		// Verificar existencia
		const existing = await this.variantRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`Variant with id ${id} not found`);
		}

		// Construir objeto de actualización
		const updateData = VariantMapper.fromUpdateDto(id, dto);

		// Actualizar
		const updated = await this.variantRepository.update(id, updateData);

		if (!updated) {
			throw new NotFoundException(`Failed to update Variant`);
		}

		return updated;
	}
}
