import { Injectable, BadRequestException } from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community.repo';
import { Community } from '../../../domain/entities/community/Community';
import { CreateCommunityDto } from '../../../infra/controllers/dto/community/CreateCommunityDto';
import * as crypto from 'crypto';

@Injectable()
export class CreateCommunityUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
	) { }

	async execute(dto: CreateCommunityDto): Promise<Community> {
		// Validar que no exista una comunidad con el mismo nombre
		const existingCommunity = await this.communityRepository.findByName(dto.name);
		if (existingCommunity) {
			throw new BadRequestException(`Community with name "${dto.name}" already exists`);
		}

		// Crear entidad de dominio
		const community = new Community(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		// Persistir
		return await this.communityRepository.create(community);
	}
}
