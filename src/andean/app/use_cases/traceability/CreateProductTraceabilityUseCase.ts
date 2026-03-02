import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';
import { TraceabilityEpoch } from '../../../domain/entities/traceability/TraceabilityEpoch';
import { CreateProductTraceabilityDto } from '../../../infra/controllers/dto/traceability/CreateProductTraceabilityDto';
import * as crypto from 'crypto';

@Injectable()
export class CreateProductTraceabilityUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) {}

	async execute(
		dto: CreateProductTraceabilityDto,
	): Promise<ProductTraceability> {
		// Validar que haya al menos una época
		if (!dto.epochs || dto.epochs.length === 0) {
			throw new BadRequestException('At least one epoch is required');
		}

		// Crear entidad de dominio
		const epochs = dto.epochs.map(
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

		const traceability = new ProductTraceability(
			crypto.randomUUID(),
			dto.blockchainLink,
			epochs,
		);

		// Persistir
		return await this.traceabilityRepository.create(traceability);
	}
}
