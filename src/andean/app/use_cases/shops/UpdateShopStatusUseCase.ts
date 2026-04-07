import { Inject, Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

@Injectable()
export class UpdateShopStatusUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	handle(id: string, status: AdminEntityStatus) {
		return this.shopRepository.updateStatus(id, status);
	}
}
