import { SizeOptionAlternative } from '../../../domain/entities/textileProducts/SizeOptionAlternative';

export abstract class SizeOptionAlternativeRepository {
	abstract create(
		sizeOptionAlternative: SizeOptionAlternative,
	): Promise<SizeOptionAlternative>;
	abstract createMany(
		sizeOptionAlternatives: SizeOptionAlternative[],
	): Promise<SizeOptionAlternative[]>;
	abstract getAll(): Promise<SizeOptionAlternative[]>;
	abstract getById(id: string): Promise<SizeOptionAlternative | null>;
	abstract update(
		id: string,
		sizeOptionAlternative: SizeOptionAlternative,
	): Promise<SizeOptionAlternative>;
	abstract delete(id: string): Promise<void>;
}
