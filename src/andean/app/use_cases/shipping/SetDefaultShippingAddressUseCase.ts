import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { ShippingAddress } from '../../../domain/entities/ShippingAddress';

@Injectable()
export class SetDefaultShippingAddressUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
	) {}

	async handle(id: string): Promise<ShippingAddress> {
		const existing = await this.shippingAddressRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('ShippingAddress not found');
		}

		return this.shippingAddressRepository.setAsDefault(id, existing.customerId);
	}
}
