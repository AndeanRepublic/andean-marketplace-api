import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { UpdateShippingAddressDto } from '../../../infra/controllers/dto/UpdateShippingAddressDto';
import { ShippingAddress } from '../../../domain/entities/ShippingAddress';

@Injectable()
export class UpdateShippingAddressUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
	) {}

	async handle(
		id: string,
		dto: UpdateShippingAddressDto,
	): Promise<ShippingAddress> {
		const existing = await this.shippingAddressRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('ShippingAddress not found');
		}

		// Si se marca como default, actualizar otras direcciones del mismo cliente
		if (dto.isDefault === true && !existing.isDefault) {
			await this.shippingAddressRepository.setAsDefault(
				id,
				existing.customerId,
			);
		}

		const updated = await this.shippingAddressRepository.update(id, dto);
		return updated;
	}
}
