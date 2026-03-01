import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';

@Injectable()
export class GetAllTextilePrincipalUsesUseCase {
	constructor(
		@Inject(TextilePrincipalUseRepository)
		private readonly textilePrincipalUseRepository: TextilePrincipalUseRepository,
	) {}

	async handle(): Promise<TextilePrincipalUse[]> {
		const principalUses =
			await this.textilePrincipalUseRepository.getAllTextilePrincipalUses();
		if (principalUses.length === 0) {
			throw new NotFoundException('No principal uses found');
		}
		return principalUses;
	}
}
