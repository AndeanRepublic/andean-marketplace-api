import { CustomerProfile } from '../../domain/entities/CustomerProfile';

export abstract class CustomerProfileRepository {
  abstract getAllCustomers(): Promise<CustomerProfile[]>;
  abstract getCustomerByPhoneNumber(
    phoneNumber: string,
  ): Promise<CustomerProfile | null>;
  abstract saveCustomer(user: CustomerProfile): Promise<CustomerProfile>;
  abstract getCustomerById(id: string): Promise<CustomerProfile | null>;
  // updateUser(user: CustomerProfile): Promise<void>;
  // deleteUserById(id: string): Promise<void>;
}
