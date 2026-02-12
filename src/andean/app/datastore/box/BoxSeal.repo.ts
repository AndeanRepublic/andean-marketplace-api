import { BoxSeal } from '../../../domain/entities/box/BoxSeal';

export abstract class BoxSealRepository {
	abstract create(boxSeal: BoxSeal): Promise<BoxSeal>;
	abstract getAll(): Promise<BoxSeal[]>;
	abstract getById(id: string): Promise<BoxSeal | null>;
	abstract update(id: string, boxSeal: Partial<BoxSeal>): Promise<BoxSeal>;
	abstract delete(id: string): Promise<void>;
	abstract getByIds(ids: string[]): Promise<BoxSeal[]>;
}
