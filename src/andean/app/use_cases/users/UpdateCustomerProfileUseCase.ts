import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { UpdateCustomerProfileDto } from '../../../infra/controllers/dto/UpdateCustomerProfileDto';
import { CustomerProfileMapper } from '../../../infra/services/CustomerProfileMapper';

@Injectable()
export class UpdateCustomerProfileUseCase {
  constructor(private readonly userRepository: CustomerProfileRepository) {}

  async handle(
    userId: string,
    updateDto: UpdateCustomerProfileDto,
  ): Promise<void> {
    const profileFound = await this.userRepository.getCustomerByUserId(userId);
    if (!profileFound) {
      throw new NotFoundException('Profile not found');
    }
    const toUpdate = CustomerProfileMapper.fromUpdateDto(
      profileFound.id,
      userId,
      updateDto,
    );
    return this.userRepository.updateCustomerById(userId, toUpdate);
  }
}
