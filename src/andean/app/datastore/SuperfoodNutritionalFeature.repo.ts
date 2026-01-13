import { SuperfoodNutritionalFeature } from '../../domain/entities/superfoods/SuperfoodNutritionalFeature';

export abstract class SuperfoodNutritionalFeatureRepository {
	abstract getById(id: string): Promise<SuperfoodNutritionalFeature | null>;

	abstract getAll(): Promise<SuperfoodNutritionalFeature[]>;

	abstract save(feature: SuperfoodNutritionalFeature): Promise<SuperfoodNutritionalFeature>;

	abstract update(feature: SuperfoodNutritionalFeature): Promise<SuperfoodNutritionalFeature>;

	abstract delete(id: string): Promise<void>;
}
