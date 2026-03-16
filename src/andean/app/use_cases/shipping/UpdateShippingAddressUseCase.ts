import {
	Inject,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { UpdateShippingAddressDto } from '../../../infra/controllers/dto/UpdateShippingAddressDto';
import { ShippingAddress } from '../../../domain/entities/ShippingAddress';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class UpdateShippingAddressUseCase {
	constructor(
		@Inject(ShippingAddressRepository)
		private readonly shippingAddressRepository: ShippingAddressRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
	) {}

	async handle(
		id: string,
		requestingUserId: string,
		roles: AccountRole[],
		dto: UpdateShippingAddressDto,
	): Promise<ShippingAddress> {
		const existing = await this.shippingAddressRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('ShippingAddress not found');
		}

		// Pattern E ownership check WITH admin bypass on PUT /shipping-addresses/:id
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			const customer =
				await this.customerProfileRepository.getCustomerByUserId(
					requestingUserId,
				);
			if (!customer || customer.id !== existing.customerId) {
				throw new ForbiddenException('You can only modify your own resource');
			}
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
