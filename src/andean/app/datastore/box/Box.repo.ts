import { Box } from '../../../domain/entities/box/Box';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export abstract class BoxRepository {
	abstract create(box: Box): Promise<Box>;
	abstract getById(id: string): Promise<Box | null>;
	abstract getAll(page: number, perPage: number): Promise<{ data: Box[]; total: number }>;
	abstract update(box: Box): Promise<Box>;
	abstract updateStatus(id: string, status: AdminEntityStatus): Promise<Box | null>;
	abstract delete(id: string): Promise<void>;
}
