import { SuperfoodBenefit } from '../../domain/entities/superfoods/SuperfoodBenefit';

export abstract class SuperfoodBenefitRepository {
	abstract getById(id: string): Promise<SuperfoodBenefit | null>;

	abstract getAll(): Promise<SuperfoodBenefit[]>;

	abstract save(benefit: SuperfoodBenefit): Promise<SuperfoodBenefit>;

	abstract update(benefit: SuperfoodBenefit): Promise<SuperfoodBenefit>;

	abstract delete(id: string): Promise<void>;
}
