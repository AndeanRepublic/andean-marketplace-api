import { User } from '../../domain/entities/user';

export abstract class UserRepository {
  abstract getAllUsers(): Promise<User[]>;
  // getUserById(id: string): Promise<User | null>;
  abstract saveUser(user: User): Promise<User>;
  // updateUser(user: User): Promise<void>;
  // deleteUserById(id: string): Promise<void>;
}
