import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { UpdateCustomerProfileDto } from '../../../infra/controllers/dto/UpdateCustomerProfileDto';
import { CustomerProfileMapper } from '../../../infra/services/CustomerProfileMapper';

@Injectable()
export class UpdateCustomerProfileUseCase {
	constructor(
		private readonly userRepository: CustomerProfileRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(
		userId: string,
		updateDto: UpdateCustomerProfileDto,
	): Promise<void> {
		const profileFound = await this.userRepository.getCustomerByUserId(userId);
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
			userId,
			updateDto,
		);
		return this.userRepository.updateCustomerById(userId, toUpdate);
	}
}
