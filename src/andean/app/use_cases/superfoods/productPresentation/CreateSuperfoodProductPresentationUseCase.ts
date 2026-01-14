import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { CreateSuperfoodProductPresentationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodProductPresentationDto';

@Injectable()
export class CreateSuperfoodProductPresentationUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) { }

	async handle(dto: CreateSuperfoodProductPresentationDto): Promise<SuperfoodProductPresentation> {
		const productPresentation = new SuperfoodProductPresentation(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		return await this.productPresentationRepository.save(productPresentation);
	}
}
