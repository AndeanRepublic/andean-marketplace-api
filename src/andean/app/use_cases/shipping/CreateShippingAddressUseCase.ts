import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CreateShippingAddressDto } from '../../../infra/controllers/dto/CreateShippingAddressDto';
import { ShippingAddress } from '../../../domain/entities/ShippingAddress';
import { Types } from 'mongoose';

@Injectable()
export class CreateShippingAddressUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
	) {}

	async handle(
		customerId: string,
		dto: CreateShippingAddressDto,
	): Promise<ShippingAddress> {
		// Validar que el customer existe
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}

		// Si esta es la primera dirección, marcarla como default
		const existingAddresses =
			await this.shippingAddressRepository.getByCustomerId(customerId);
		const isDefault = existingAddresses.length === 0 || dto.isDefault === true;

		const now = new Date();
		const shippingAddress = new ShippingAddress(
			new Types.ObjectId().toString(),
			customerId,
			dto.recipientName,
			dto.phone,
			dto.countryCode,
			dto.country,
			dto.city,
			dto.administrativeArea,
			dto.addressLine1,
			dto.addressLine2,
			dto.postalCode,
			isDefault,
			now,
			now,
		);

		const created =
			await this.shippingAddressRepository.create(shippingAddress);

		// Si se marcó como default y hay otras direcciones, quitar default de las otras
		if (isDefault && existingAddresses.length > 0) {
			return this.shippingAddressRepository.setAsDefault(
				created.id,
				customerId,
			);
		}

		return created;
	}
}
