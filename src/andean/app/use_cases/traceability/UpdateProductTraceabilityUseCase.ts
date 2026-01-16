import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';
import { TraceabilityEpoch } from '../../../domain/entities/traceability/TraceabilityEpoch';
import { UpdateProductTraceabilityDto } from '../../../infra/controllers/dto/traceability/UpdateProductTraceabilityDto';

@Injectable()
export class UpdateProductTraceabilityUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) { }

	async execute(
		id: string,
		dto: UpdateProductTraceabilityDto,
	): Promise<ProductTraceability> {
		// Verificar existencia
		const existing = await this.traceabilityRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`Traceability with id ${id} not found`);
		}

		// Validar que si se actualizan las épocas, haya al menos una
		if (dto.epochs && dto.epochs.length === 0) {
			throw new BadRequestException('At least one epoch is required');
		}

		// Preparar datos de actualización
		const updateData: Partial<ProductTraceability> = {};

		if (dto.blockchainLink) updateData.blockchainLink = dto.blockchainLink;
		if (dto.epochs) {
			updateData.epochs = dto.epochs.map(
				(epoch) =>
					new TraceabilityEpoch(
						epoch.title,
						epoch.country,
						epoch.city,
						epoch.description,
						epoch.processName,
						epoch.supplier,
					),
			);
		}

		// Actualizar
		const updated = await this.traceabilityRepository.update(id, updateData);

		if (!updated) {
			throw new NotFoundException(`Failed to update Traceability`);
		}

		return updated;
	}
}
