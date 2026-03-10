import { SuperfoodCertification } from '../../../domain/entities/superfoods/SuperfoodCertification';

export abstract class SuperfoodCertificationRepository {
	abstract getById(id: string): Promise<SuperfoodCertification | null>;

	abstract getAll(): Promise<SuperfoodCertification[]>;

	abstract save(
		certification: SuperfoodCertification,
	): Promise<SuperfoodCertification>;

	abstract update(
		certification: SuperfoodCertification,
	): Promise<SuperfoodCertification>;

	abstract delete(id: string): Promise<void>;

	abstract saveMany(
		certifications: SuperfoodCertification[],
	): Promise<SuperfoodCertification[]>;
}
