import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { AddItemToCartUseCase } from '../../app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from '../../app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByCustomerUseCase } from '../../app/use_cases/cart_shop/GetCartByCustomerUseCase';
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
    private readonly getCartByCustomerUseCase: GetCartByCustomerUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
  ) {}

  @Get('')
  async getCustomerCart(@Param('customerId') customerId: string): Promise<CartShop> {
    return this.getCartByCustomerUseCase.handle(customerId);
  }

  @Post(path_cart_items)
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

  @Delete(path_remove_cart_item)
  async removeItemFromCart(
    @Param('customerId') customerId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.removeItemFromCartUseCase.handle(customerId, itemId);
  }
}
