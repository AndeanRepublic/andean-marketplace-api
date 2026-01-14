import { Injectable, BadRequestException } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductRegion } from '../../../domain/entities/origin/OriginProductRegion';
import { CreateOriginProductRegionDto } from '../../../infra/controllers/dto/origin/CreateOriginProductRegionDto';
import * as crypto from 'crypto';

@Injectable()
export class CreateOriginProductRegionUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) { }

	async execute(dto: CreateOriginProductRegionDto): Promise<OriginProductRegion> {
		// Validar que no exista una región con el mismo nombre
		const existingRegion = await this.regionRepository.findByName(dto.name);
		if (existingRegion) {
			throw new BadRequestException(`Region with name "${dto.name}" already exists`);
		}

		// Crear entidad de dominio
		const region = new OriginProductRegion(
			crypto.randomUUID(),
			dto.name,
		);

		// Persistir
		return await this.regionRepository.create(region);
	}
}
