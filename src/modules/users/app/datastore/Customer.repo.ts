import { Customer } from '../../domain/entities/Customer';

export abstract class UserRepository {
  abstract getAllCustomers(): Promise<Customer[]>;
  abstract getCustomerByEmail(email: string): Promise<Customer | null>;
  abstract getCustomerByPhoneNumber(
    phoneNumber: string,
  ): Promise<Customer | null>;
  abstract saveCustomer(user: Customer): Promise<Customer>;
  // updateUser(user: Customer): Promise<void>;
  // deleteUserById(id: string): Promise<void>;
}
