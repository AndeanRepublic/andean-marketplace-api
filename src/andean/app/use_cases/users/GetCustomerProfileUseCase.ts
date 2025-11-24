import { Injectable } from '@nestjs/common';
import { CustomerProfile } from '../../../domain/entities/CustomerProfile';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';

@Injectable()
export class GetCustomerProfileUseCase {
  constructor(private readonly userRepository: CustomerProfileRepository) {}

  async handle(userId: string): Promise<CustomerProfile | null> {
    return this.userRepository.getCustomerByUserId(userId);
  }
}
