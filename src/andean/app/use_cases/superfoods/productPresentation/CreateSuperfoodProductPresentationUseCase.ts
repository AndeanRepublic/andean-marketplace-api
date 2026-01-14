import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { CreateSuperfoodProductPresentationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodProductPresentationDto';
import { SuperfoodProductPresentationResponse } from '../../../modules/SuperfoodProductPresentationResponse';

@Injectable()
export class CreateSuperfoodProductPresentationUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) { }

	async handle(dto: CreateSuperfoodProductPresentationDto): Promise<SuperfoodProductPresentationResponse> {
		const productPresentation = new SuperfoodProductPresentation(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		const savedPresentation = await this.productPresentationRepository.save(productPresentation);
		return {
			id: savedPresentation.id,
			name: savedPresentation.name,
			icon: dto.icon,
			createdAt: savedPresentation.createdAt!,
			updatedAt: savedPresentation.updatedAt!,
		};
	}
}
