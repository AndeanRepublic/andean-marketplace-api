import { Seal } from '../../../domain/entities/community/Seal';

export abstract class SealRepository {
	abstract getAll(): Promise<Seal[]>;
	abstract getById(id: string): Promise<Seal | null>;
	abstract create(seal: Seal): Promise<Seal>;
	abstract createMany(seals: Seal[]): Promise<Seal[]>;
	abstract update(id: string, seal: Seal): Promise<Seal>;
	abstract delete(id: string): Promise<void>;
}
