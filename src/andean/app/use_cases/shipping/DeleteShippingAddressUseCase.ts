import {
	Inject,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { ShippingAddressRepository } from '../../datastore/ShippingAddress.repo';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class DeleteShippingAddressUseCase {
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
	): Promise<void> {
		const existing = await this.shippingAddressRepository.getById(id);
		if (!existing) {
			throw new NotFoundException('ShippingAddress not found');
		}

		// Pattern E ownership check WITH admin bypass on DELETE /shipping-addresses/:id
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

		await this.shippingAddressRepository.delete(id);
	}
}
