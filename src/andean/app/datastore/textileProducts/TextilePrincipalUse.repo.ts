import { TextilePrincipalUse } from '../../../domain/entities/textileProducts/TextilePrincipalUse';

export abstract class TextilePrincipalUseRepository {
	abstract getAllTextilePrincipalUses(): Promise<TextilePrincipalUse[]>;
	abstract getTextilePrincipalUseById(
		id: string,
	): Promise<TextilePrincipalUse | null>;
	abstract saveTextilePrincipalUse(
		principalUse: TextilePrincipalUse,
	): Promise<TextilePrincipalUse>;
	abstract createManyTextilePrincipalUses(
		principalUses: TextilePrincipalUse[],
	): Promise<TextilePrincipalUse[]>;
	abstract updateTextilePrincipalUse(
		id: string,
		principalUse: TextilePrincipalUse,
	): Promise<TextilePrincipalUse>;
	abstract deleteTextilePrincipalUse(id: string): Promise<void>;
}
