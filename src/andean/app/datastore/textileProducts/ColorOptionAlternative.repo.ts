import { ColorOptionAlternative } from '../../../domain/entities/textileProducts/ColorOptionAlternative';

export abstract class ColorOptionAlternativeRepository {
	abstract create(
		colorOptionAlternative: ColorOptionAlternative,
	): Promise<ColorOptionAlternative>;
	abstract createMany(
		colorOptionAlternatives: ColorOptionAlternative[],
	): Promise<ColorOptionAlternative[]>;
	abstract getAll(): Promise<ColorOptionAlternative[]>;
	abstract getById(id: string): Promise<ColorOptionAlternative | null>;
	abstract update(
		id: string,
		colorOptionAlternative: ColorOptionAlternative,
	): Promise<ColorOptionAlternative>;
	abstract delete(id: string): Promise<void>;
}
