import {
	Controller,
	Get,
	Param,
	Post,
	Delete,
	Body,
	Patch,
	ParseIntPipe,
} from '@nestjs/common';
import { AddItemToCartUseCase } from '../../app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from '../../app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByCustomerUseCase } from '../../app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { RemoveItemFromCartUseCase } from '../../app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
import { AddCartItemDto } from './dto/AddCartItemDto';
import { CartItemQuantityResponse } from '../../app/models/cart/CartItemQuantityResponse';
import { AddCartItemResponse } from '../../app/models/AddCartItemResponse';
import { GetCartResponse } from '../../app/models/cart/GetCartResponse';

const root_path = 'users/customers/:userId/cart';
const path_cart_items = '/items';
const path_remove_cart_item = path_cart_items + '/:itemId';
const path_update_cart_item_quantity =
	path_cart_items + '/:itemId/quantity/:quantityDelta';

@Controller(root_path)
export class CartShopController {
	constructor(
		private readonly addItemToCartUseCase: AddItemToCartUseCase,
		private readonly cleanCartUseCase: CleanCartUseCase,
		private readonly getCartByCustomerUseCase: GetCartByCustomerUseCase,
		private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
		private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
	) { }

	@Get('')
	async getCustomerCart(
		@Param('userId') customerId: string,
	): Promise<GetCartResponse> {
		return this.getCartByCustomerUseCase.handle(customerId);
	}

	@Post(path_cart_items)
	async addItemToCart(
		@Param('userId') customerId: string,
		@Body() body: AddCartItemDto,
	): Promise<AddCartItemResponse> {
		return this.addItemToCartUseCase.handle(customerId, body);
	}

	@Delete('')
	async cleanCart(@Param('userId') customerId: string): Promise<void> {
		return this.cleanCartUseCase.handle(customerId);
	}

	@Delete(path_remove_cart_item)
	async removeItemFromCart(
		@Param('userId') customerId: string,
		@Param('itemId') itemId: string,
	): Promise<void> {
		return this.removeItemFromCartUseCase.handle(customerId, itemId);
	}

	@Patch(path_update_cart_item_quantity)
	async updateCartItemQuantity(
		@Param('itemId') itemId: string,
		@Param('quantityDelta', ParseIntPipe) quantityDelta: number,
	): Promise<CartItemQuantityResponse> {
		return this.updateCartItemQuantityUseCase.handle(itemId, quantityDelta);
	}
}
