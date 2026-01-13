import { SuperfoodPreservationMethod } from '../../domain/entities/superfoods/SuperfoodPreservationMethod';

export abstract class SuperfoodPreservationMethodRepository {
	abstract getById(id: string): Promise<SuperfoodPreservationMethod | null>;

	abstract getAll(): Promise<SuperfoodPreservationMethod[]>;

	abstract save(method: SuperfoodPreservationMethod): Promise<SuperfoodPreservationMethod>;

	abstract update(method: SuperfoodPreservationMethod): Promise<SuperfoodPreservationMethod>;

	abstract delete(id: string): Promise<void>;
}
