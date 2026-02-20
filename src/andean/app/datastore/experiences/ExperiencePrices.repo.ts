import { ExperiencePrices } from '../../../domain/entities/experiences/ExperiencePrices';

export abstract class ExperiencePricesRepository {
	abstract getAll(): Promise<ExperiencePrices[]>;
	abstract getById(id: string): Promise<ExperiencePrices | null>;
	abstract save(entity: ExperiencePrices): Promise<ExperiencePrices>;
	abstract update(
		id: string,
		entity: Partial<ExperiencePrices>,
	): Promise<ExperiencePrices>;
	abstract delete(id: string): Promise<void>;
}
