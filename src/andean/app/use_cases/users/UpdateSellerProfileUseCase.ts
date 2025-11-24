import { Injectable, NotFoundException } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { UpdateSellerProfileDto } from '../../../infra/controllers/dto/UpdateSellerProfileDto';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';

@Injectable()
export class UpdateSellerProfileUseCase {
  constructor(private readonly sellerRepository: SellerProfileRepository) {}

  async handle(
    userId: string,
    updateDto: UpdateSellerProfileDto,
  ): Promise<void> {
    const profileFound = await this.sellerRepository.getSellerByUserId(userId);
    if (!profileFound) {
      throw new NotFoundException('Profile not found');
    }
    const toUpdate = SellerProfileMapper.fromUpdateDto(
      profileFound.id,
      userId,
      updateDto,
    );
    return this.sellerRepository.updateSellerByUserId(userId, toUpdate);
  }
}
