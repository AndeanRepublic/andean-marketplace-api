import { SellerProfile } from '../../domain/entities/SellerProfile';

export abstract class SellerProfileRepository {
  abstract getAllSellers(): Promise<SellerProfile[]>;
  abstract getSellerByPhoneNumber(
    phoneNumber: string,
  ): Promise<SellerProfile | null>;
  abstract getSellerById(id: string): Promise<SellerProfile | null>;
  abstract getSellerByUserId(userId: string): Promise<SellerProfile | null>;
  abstract saveSeller(seller: SellerProfile): Promise<SellerProfile>;
  abstract updateSellerByUserId(
    userId: string,
    profile: SellerProfile,
  ): Promise<void>;
  // deleteSellerById(id: string): Promise<void>;
}
