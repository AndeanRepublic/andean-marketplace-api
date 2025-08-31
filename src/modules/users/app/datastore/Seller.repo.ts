import { Seller } from '../../domain/entities/seller';

export abstract class SellerRepository {
  abstract getAllSellers(): Promise<Seller[]>;
  abstract getSellerByEmail(email: string): Promise<Seller | null>;
  abstract getSellerByPhoneNumber(phoneNumber: string): Promise<Seller | null>;
  // getSellerById(id: string): Promise<Seller | null>;
  abstract saveSeller(seller: Seller): Promise<Seller>;
  // updateSeller(seller: Seller): Promise<void>;
  // deleteSellerById(id: string): Promise<void>;
}
