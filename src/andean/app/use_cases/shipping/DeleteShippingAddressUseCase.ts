import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';

@Injectable()
export class DeleteShippingAddressUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
	) {}

	async handle(id: string): Promise<void> {
		const existing = await this.shippingAddressRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('ShippingAddress not found');
		}

		await this.shippingAddressRepository.delete(id);
	}
}
