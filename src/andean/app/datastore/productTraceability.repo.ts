import { ProductTraceability } from '../../domain/entities/ProductTraceability';
import { ProductType } from '../../domain/enums/ProductType';

export abstract class ProductTraceabilityRepository {
	abstract create(traceability: ProductTraceability): Promise<ProductTraceability>;
	abstract findById(id: string): Promise<ProductTraceability | null>;
	abstract findAll(): Promise<ProductTraceability[]>;
	abstract findByProductId(productId: string): Promise<ProductTraceability | null>;
	abstract findByProductType(productType: ProductType): Promise<ProductTraceability[]>;
	abstract update(
		id: string,
		traceability: Partial<ProductTraceability>,
	): Promise<ProductTraceability | null>;
	abstract delete(id: string): Promise<boolean>;
}
