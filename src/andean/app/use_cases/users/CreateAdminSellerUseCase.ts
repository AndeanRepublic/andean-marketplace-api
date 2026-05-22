import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from '../../../infra/controllers/dto/CreateSellerDto';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { SellerProfileResponse } from '../../models/users/SellerProfileResponse';
import { CreateSellerUseCase } from './CreateSellerUseCase';
import { SellerCreationMode } from '../../../domain/enums/SellerCreationMode';

@Injectable()
export class CreateAdminSellerUseCase {
	constructor(private readonly createSellerUseCase: CreateSellerUseCase) {}

	async handle(dto: CreateSellerDto): Promise<SellerProfileResponse> {
		const seller = await this.createSellerUseCase.handle(
			dto,
			SellerCreationMode.ADMIN,
		);
		return SellerProfileMapper.toResponse(seller);
	}
}
