import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductCommunity } from '../../../domain/entities/origin/OriginProductCommunity';
import { CreateOriginProductCommunityDto } from '../../../infra/controllers/dto/origin/CreateOriginProductCommunityDto';
import * as crypto from 'crypto';

@Injectable()
export class CreateOriginProductCommunityUseCase {
	constructor(
		private readonly communityRepository: OriginProductCommunityRepository,
		private readonly regionRepository: OriginProductRegionRepository,
	) { }

	async execute(dto: CreateOriginProductCommunityDto): Promise<OriginProductCommunity> {
		// Validar que la región exista
		const region = await this.regionRepository.findById(dto.regionId);
		if (!region) {
			throw new NotFoundException(`Region with id ${dto.regionId} not found`);
		}

		// Validar que no exista una comunidad con el mismo nombre
		const existingCommunity = await this.communityRepository.findByName(dto.name);
		if (existingCommunity) {
			throw new BadRequestException(`Community with name "${dto.name}" already exists`);
		}

		// Crear entidad de dominio
		const community = new OriginProductCommunity(
			crypto.randomUUID(),
			dto.name,
			dto.regionId,
		);

		// Persistir
		return await this.communityRepository.create(community);
	}
}
