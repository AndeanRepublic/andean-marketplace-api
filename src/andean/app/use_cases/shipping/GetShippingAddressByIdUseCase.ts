import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { ShippingAddress } from '../../../domain/entities/ShippingAddress';

@Injectable()
export class GetShippingAddressByIdUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
	) {}

	async handle(id: string): Promise<ShippingAddress> {
		const address = await this.shippingAddressRepository.getById(id);
		if (!address) {
			throw new NotFoundException('ShippingAddress not found');
		}
		return address;
	}
}
