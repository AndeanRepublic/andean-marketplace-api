import { Seller } from '../../domain/entities/seller';

export interface SellerRepository {
  getAllSellers(): Promise<Seller[]>;
  getSellerById(id: string): Promise<Seller | null>;
  saveSeller(seller: Seller): Promise<void>;
  updateSeller(seller: Seller): Promise<void>;
  deleteSellerById(id: string): Promise<void>;
}
