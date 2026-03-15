import {
	Inject,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { CustomerProfileRepository } from '../datastore/Customer.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class DeleteReviewUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerProfileRepository: CustomerProfileRepository,
	) {}

	async handle(
		id: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
		const reviewFound = await this.reviewRepository.getById(id);
		if (!reviewFound) {
			throw new NotFoundException('Review not found');
		}

		// Pattern E ownership check WITH admin bypass on DELETE /reviews/:id
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			const customer =
				await this.customerProfileRepository.getCustomerByUserId(
					requestingUserId,
				);
			if (!customer || customer.id !== reviewFound.customerId) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		await this.reviewRepository.delete(id);
		return;
	}
}
