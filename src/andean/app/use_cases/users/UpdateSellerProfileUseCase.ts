import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { UpdateSellerProfileDto } from '../../../infra/controllers/dto/UpdateSellerProfileDto';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { AccountRole } from '../../../domain/enums/AccountRole';

@Injectable()
export class UpdateSellerProfileUseCase {
	constructor(private readonly sellerRepository: SellerProfileRepository) {}

	async handle(
		paramUserId: string,
		requestingUserId: string,
		roles: AccountRole[],
		updateDto: UpdateSellerProfileDto,
	): Promise<void> {
		if (
			requestingUserId !== paramUserId &&
			!roles.includes(AccountRole.ADMIN)
		) {
			throw new ForbiddenException('You can only update your own profile');
		}

		const profileFound =
			await this.sellerRepository.getSellerByUserId(paramUserId);
		if (!profileFound) {
			throw new NotFoundException('Profile not found');
		}
		const toUpdate = SellerProfileMapper.fromUpdateDto(
			profileFound.id,
			paramUserId,
			updateDto,
		);
		return this.sellerRepository.updateSellerByUserId(paramUserId, toUpdate);
	}
}
