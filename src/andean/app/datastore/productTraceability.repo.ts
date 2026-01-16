import { ProductTraceability } from '../../domain/entities/ProductTraceability';

export abstract class ProductTraceabilityRepository {
	abstract create(
		traceability: ProductTraceability,
	): Promise<ProductTraceability>;
	abstract findById(id: string): Promise<ProductTraceability | null>;
	abstract findAll(): Promise<ProductTraceability[]>;
	abstract update(
		id: string,
		traceability: Partial<ProductTraceability>,
	): Promise<ProductTraceability | null>;
	abstract delete(id: string): Promise<boolean>;
}
