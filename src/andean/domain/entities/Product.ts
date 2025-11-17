import { ProductStatus } from '../enums/ProductStatus';

export class Product {
  constructor(
    public id: string,
    public shopId: string,
    public sellerId: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public category: string,
    public status: ProductStatus,
  ) {}
}
