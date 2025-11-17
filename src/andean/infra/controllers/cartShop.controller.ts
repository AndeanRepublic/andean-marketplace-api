import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { AddItemToCartUseCase } from '../../app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from '../../app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByUserUseCase } from '../../app/use_cases/cart_shop/GetCartByUserUseCase';
import { RemoveItemFromCartUseCase } from '../../app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { CartShop } from '../../domain/entities/CartShop';
import { AddCartItemDto } from './dto/AddCartItemDto';

@Controller('users/customers/:customerId/cart')
export class CartShopController {
  constructor(
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly cleanCartUseCase: CleanCartUseCase,
    private readonly getCartByUserUseCase: GetCartByUserUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
  ) {}

  @Get('')
  async findByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<CartShop> {
    return this.getCartByUserUseCase.handle(customerId);
  }

  @Post('/products')
  async addItemToCart(
    @Param('customerId') customerId: string,
    @Body() body: AddCartItemDto,
  ): Promise<CartShop> {
    return this.addItemToCartUseCase.handle(customerId, body);
  }

  @Delete('')
  async cleanCart(@Param('customerId') customerId: string): Promise<void> {
    return this.cleanCartUseCase.handle(customerId);
  }

  @Delete('/products/:productId')
  async removeItemFromCart(
    @Param('customerId') customerId: string,
    @Param('productId') productId: string): Promise<CartShop> {
    return this.removeItemFromCartUseCase.handle(customerId, productId);
  }
}
