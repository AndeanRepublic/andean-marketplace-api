import { SizeOptionAlternative } from '../../../domain/entities/superfoods/SizeOptionAlternative';

export abstract class SuperfoodSizeOptionAlternativeRepository {
	abstract createMany(
		sizeOptionAlternatives: SizeOptionAlternative[],
	): Promise<SizeOptionAlternative[]>;

	abstract getByIds(ids: string[]): Promise<SizeOptionAlternative[]>;

	abstract deleteManyByIds(ids: string[]): Promise<void>;
}
