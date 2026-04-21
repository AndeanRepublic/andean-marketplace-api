import { Box } from '../../../domain/entities/box/Box';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export type BoxIdWithFulfillable = {
	id: string;
	fulfillableQuantity: number;
};

export abstract class BoxRepository {
	abstract create(box: Box): Promise<Box>;
	abstract getById(id: string): Promise<Box | null>;
	abstract getAll(page: number, perPage: number): Promise<{ data: Box[]; total: number }>;
	/**
	 * Boxes con fulfillableQuantity > 0 (misma regla que computeBoxListMetrics en agregación).
	 * Paginación y total coherentes con el filtro.
	 */
	abstract getIdsPageWithPositiveFulfillableStock(
		page: number,
		perPage: number,
	): Promise<{ items: BoxIdWithFulfillable[]; total: number }>;
	abstract getByIdsInOrder(ids: string[]): Promise<Box[]>;
	abstract update(box: Box): Promise<Box>;
	abstract updateStatus(id: string, status: AdminEntityStatus): Promise<Box | null>;
	abstract delete(id: string): Promise<void>;
}
