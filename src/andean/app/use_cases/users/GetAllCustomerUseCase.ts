import { Injectable } from '@nestjs/common';
import { CustomerProfile } from '../../../domain/entities/CustomerProfile';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';

@Injectable()
export class GetAllCustomerUseCase {
  constructor(private readonly userRepository: CustomerProfileRepository) {}

  async handle(): Promise<CustomerProfile[]> {
    return this.userRepository.getAllCustomers();
  }
}
