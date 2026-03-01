import { Variant } from '../../domain/entities/Variant';

export abstract class VariantRepository {
	abstract create(variant: Variant): Promise<Variant>;
	abstract createMany(variants: Variant[]): Promise<Variant[]>;
	abstract getById(id: string): Promise<Variant | null>;
	abstract getAll(): Promise<Variant[]>;
	abstract getByProductId(productId: string): Promise<Variant[]>;
	abstract update(
		id: string,
		variant: Partial<Variant>,
	): Promise<Variant | null>;
	abstract delete(id: string): Promise<boolean>;
	abstract deleteByProductId(productId: string): Promise<boolean>;
	abstract getByIds(ids: string[]): Promise<Variant[]>;
	abstract reduceStock(id: string, quantity: number): Promise<Variant | null>;
}
