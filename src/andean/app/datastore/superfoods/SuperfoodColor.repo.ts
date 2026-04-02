import { SuperfoodColor } from '../../../domain/entities/superfoods/SuperfoodColor';

export abstract class SuperfoodColorRepository {
	abstract getById(id: string): Promise<SuperfoodColor | null>;

	abstract getAll(): Promise<SuperfoodColor[]>;

	abstract save(color: SuperfoodColor): Promise<SuperfoodColor>;

	abstract update(color: SuperfoodColor): Promise<SuperfoodColor>;

	abstract delete(id: string): Promise<void>;

	abstract saveMany(colors: SuperfoodColor[]): Promise<SuperfoodColor[]>;
}
