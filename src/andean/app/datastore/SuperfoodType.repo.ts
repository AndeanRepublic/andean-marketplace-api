import { SuperfoodType } from '../../domain/entities/superfoods/SuperfoodType';

export abstract class SuperfoodTypeRepository {
	abstract getById(id: string): Promise<SuperfoodType | null>;

	abstract getAll(): Promise<SuperfoodType[]>;

	abstract save(type: SuperfoodType): Promise<SuperfoodType>;

	abstract update(type: SuperfoodType): Promise<SuperfoodType>;

	abstract delete(id: string): Promise<void>;
}
