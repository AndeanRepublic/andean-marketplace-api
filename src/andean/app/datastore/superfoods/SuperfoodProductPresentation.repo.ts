import { SuperfoodProductPresentation } from '../../../domain/entities/superfoods/SuperfoodProductPresentation';

export abstract class SuperfoodProductPresentationRepository {
	abstract getById(id: string): Promise<SuperfoodProductPresentation | null>;

	abstract getAll(): Promise<SuperfoodProductPresentation[]>;

	abstract save(presentation: SuperfoodProductPresentation): Promise<SuperfoodProductPresentation>;

	abstract update(presentation: SuperfoodProductPresentation): Promise<SuperfoodProductPresentation>;

	abstract delete(id: string): Promise<void>;
}
