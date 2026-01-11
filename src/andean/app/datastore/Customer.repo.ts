import { CustomerProfile } from '../../domain/entities/CustomerProfile';

export abstract class CustomerProfileRepository {
  abstract getAllCustomers(): Promise<CustomerProfile[]>;
  abstract getCustomerByUserId(userId: string): Promise<CustomerProfile | null>;
  abstract getCustomerByPhoneNumber(
    phoneNumber: string,
  ): Promise<CustomerProfile | null>;
  abstract saveCustomer(user: CustomerProfile): Promise<CustomerProfile>;
  abstract getCustomerById(id: string): Promise<CustomerProfile | null>;
  abstract updateCustomerById(
    userId: string,
    profile: CustomerProfile,
  ): Promise<void>;
  // deleteUserById(id: string): Promise<void>;
}
