import {
	Inject,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { ReviewRepository } from '../datastore/Review.repo';
import { AccountRepository } from '../datastore/Account.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class DeleteReviewUseCase {
	constructor(
		@Inject(ReviewRepository)
		private readonly reviewRepository: ReviewRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
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

		// Ownership check with admin bypass on DELETE /reviews/:id
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (reviewFound.accountId !== requestingUserId) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		await this.reviewRepository.delete(id);
		return;
	}
}
