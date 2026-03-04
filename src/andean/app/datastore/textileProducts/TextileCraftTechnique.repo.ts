import { TextileCraftTechnique } from '../../../domain/entities/textileProducts/TextileCraftTechnique';

export abstract class TextileCraftTechniqueRepository {
	abstract getAllTextileCraftTechniques(): Promise<TextileCraftTechnique[]>;
	abstract getTextileCraftTechniqueById(
		id: string,
	): Promise<TextileCraftTechnique | null>;
	abstract saveTextileCraftTechnique(
		technique: TextileCraftTechnique,
	): Promise<TextileCraftTechnique>;
	abstract createManyTextileCraftTechniques(
		techniques: TextileCraftTechnique[],
	): Promise<TextileCraftTechnique[]>;
	abstract updateTextileCraftTechnique(
		id: string,
		technique: TextileCraftTechnique,
	): Promise<TextileCraftTechnique>;
	abstract deleteTextileCraftTechnique(id: string): Promise<void>;
}
