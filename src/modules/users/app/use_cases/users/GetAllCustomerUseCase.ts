import { Injectable } from '@nestjs/common';
import { Customer } from '../../../domain/entities/Customer';
import { UserRepository } from '../../datastore/Customer.repo';

@Injectable()
export class GetAllCustomerUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(): Promise<Customer[]> {
    return this.userRepository.getAllCustomers();
  }
}
