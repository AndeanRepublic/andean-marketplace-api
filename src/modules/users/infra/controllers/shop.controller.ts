import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetShopByIdUseCase } from '../../app/use_cases/shops/GetShopByIdUseCase';
import { GetShopsByCategoryUseCase } from '../../app/use_cases/shops/GetShopsByCategoryUseCase';
import { GetShopsBySellerIdUseCase } from '../../app/use_cases/shops/GetShopsBySellerIdUseCase';
import { DeleteShopUseCase } from '../../app/use_cases/shops/DeleteShopUseCase';
import { CreateShopUseCase } from '../../app/use_cases/shops/CreateShopUseCase';
import { Shop } from '../../domain/entities/Shop';
import { CreateShopDto } from './dto/CreateShopDto';

@Controller('shops')
export class ShopController {
  constructor(
    private readonly getShopsByIdUseCase: GetShopByIdUseCase,
    private readonly getShopsByCategoryUseCase: GetShopsByCategoryUseCase,
    private readonly getShopsBySellerIdUseCase: GetShopsBySellerIdUseCase,
    private readonly createShopUseCase: CreateShopUseCase,
    private readonly deleteShopUseCase: DeleteShopUseCase,
  ) {}

  @Get('/:shopId')
  async findById(@Param('shopId') shopId: string): Promise<Shop> {
    return this.getShopsByIdUseCase.handle(shopId);
  }

  @Get('/by-seller/:sellerId')
  async finBySeller(@Param('sellerId') sellerId: string): Promise<Shop[]> {
    return this.getShopsBySellerIdUseCase.handle(sellerId);
  }

  @Get('/by-category/:categoryName')
  async getByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<Shop[]> {
    return this.getShopsByCategoryUseCase.handle(categoryName);
  }

  @Post
  async createShop(@Body() createShopDto: CreateShopDto): Promise<Shop> {
    return this.createShopUseCase.handle(createShopDto);
  }

  @Delete('/:shopId')
  async deleteShop(@Param('shopId') shopId: string): Promise<Shop> {
    return this.deleteShopUseCase.handle(shopId);
  }
}
