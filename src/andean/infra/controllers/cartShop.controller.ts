import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { AddItemToCartUseCase } from '../../app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from '../../app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByUserUseCase } from '../../app/use_cases/cart_shop/GetCartByUserUseCase';
import { RemoveItemFromCartUseCase } from '../../app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { CartShop } from '../../domain/entities/CartShop';
import { AddCartItemDto } from './dto/AddCartItemDto';

const root_path = 'users/customers/:userId/cart';
const path_cart_items = '/items';
const path_remove_cart_item = path_cart_items + '/:itemId';

@Controller(root_path)
export class CartShopController {
  constructor(
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly cleanCartUseCase: CleanCartUseCase,
    private readonly getCartByUserUseCase: GetCartByUserUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
  ) {}

  @Get('')
  async getCustomerCart(@Param('userId') userId: string): Promise<CartShop> {
    return this.getCartByUserUseCase.handle(userId);
  }

  @Post(path_cart_items)
  async addItemToCart(
    @Param('userId') userId: string,
    @Body() body: AddCartItemDto,
  ): Promise<CartShop> {
    return this.addItemToCartUseCase.handle(userId, body);
  }

  @Delete('')
  async cleanCart(@Param('userId') userId: string): Promise<void> {
    return this.cleanCartUseCase.handle(userId);
  }

  @Delete(path_remove_cart_item)
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.removeItemFromCartUseCase.handle(userId, itemId);
  }
}
