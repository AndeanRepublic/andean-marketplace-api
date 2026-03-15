import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { UpdateCustomerProfileDto } from '../../../infra/controllers/dto/UpdateCustomerProfileDto';
import { CustomerProfileMapper } from '../../../infra/services/CustomerProfileMapper';
import { AccountRole } from '../../../domain/enums/AccountRole';

@Injectable()
export class UpdateCustomerProfileUseCase {
	constructor(
		private readonly userRepository: CustomerProfileRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(
		paramUserId: string,
		requestingUserId: string,
		roles: AccountRole[],
		updateDto: UpdateCustomerProfileDto,
	): Promise<void> {
		if (
			requestingUserId !== paramUserId &&
			!roles.includes(AccountRole.ADMIN)
		) {
			throw new ForbiddenException('You can only update your own profile');
		}

		const profileFound =
			await this.userRepository.getCustomerByUserId(paramUserId);
		if (!profileFound) {
			throw new NotFoundException('Profile not found');
		}

		// Validar que el MediaItem de la foto de perfil existe si se proporciona
		if (updateDto.profilePictureMediaId) {
			const mediaItemFound = await this.mediaItemRepository.getById(
				updateDto.profilePictureMediaId,
			);
			if (!mediaItemFound) {
				throw new NotFoundException(
					`MediaItem with id ${updateDto.profilePictureMediaId} not found`,
				);
			}
		}

		const toUpdate = CustomerProfileMapper.fromUpdateDto(
			profileFound.id,
			paramUserId,
			updateDto,
		);
		return this.userRepository.updateCustomerById(paramUserId, toUpdate);
	}
}
