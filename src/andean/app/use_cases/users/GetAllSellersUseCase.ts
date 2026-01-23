import { Injectable } from '@nestjs/common';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { SellerProfileRepository } from '../../datastore/Seller.repo';

@Injectable()
export class GetAllSellersUseCase {
	constructor(private readonly sellerRepository: SellerProfileRepository) {}

	async handle(): Promise<SellerProfile[]> {
		return this.sellerRepository.getAllSellers();
	}
}
