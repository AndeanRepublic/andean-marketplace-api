import { ProductTraceabilityDocument } from '../persistence/productTraceability.schema';
import { ProductTraceability } from '../../domain/entities/ProductTraceability';
import { TraceabilityEpoch } from '../../domain/entities/traceability/TraceabilityEpoch';
import { CreateProductTraceabilityDto } from '../controllers/dto/traceability/CreateProductTraceabilityDto';
import * as crypto from 'crypto';

export class ProductTraceabilityMapper {
	static fromDocument(doc: ProductTraceabilityDocument): ProductTraceability {
		const epochs = doc.epochs.map(epoch =>
			new TraceabilityEpoch(
				epoch.title,
				epoch.country,
				epoch.city,
				epoch.description,
				epoch.processName,
				epoch.supplier,
			)
		);

		return new ProductTraceability(
			doc.id,
			doc.productId,
			doc.productType,
			doc.blockchainLink,
			epochs,
		);
	}

	static toDocument(dto: CreateProductTraceabilityDto): Partial<ProductTraceabilityDocument> {
		return {
			id: crypto.randomUUID(),
			productId: dto.productId,
			productType: dto.productType,
			blockchainLink: dto.blockchainLink,
			epochs: dto.epochs.map(epoch => ({
				title: epoch.title,
				country: epoch.country,
				city: epoch.city,
				description: epoch.description,
				processName: epoch.processName,
				supplier: epoch.supplier,
			})),
		};
	}
}
