import { Box } from '../../../domain/entities/box/Box';

export abstract class BoxRepository {
	abstract create(box: Box): Promise<Box>;
	abstract getById(id: string): Promise<Box | null>;
	abstract getAll(
		page: number,
		perPage: number,
	): Promise<{ data: Box[]; total: number }>;
	abstract delete(id: string): Promise<void>;
}
