import {
	Controller,
	Get,
	Param,
	Post,
	Delete,
	Body,
	Patch,
	ParseIntPipe,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
	ApiQuery,
} from '@nestjs/swagger';
import { AddItemToCartUseCase } from '../../app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from '../../app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByCustomerUseCase } from '../../app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { RemoveItemFromCartUseCase } from '../../app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
import { ApplyDiscountCodeUseCase } from '../../app/use_cases/cart_shop/ApplyDiscountCodeUseCase';
import { AddCartItemDto } from './dto/AddCartItemDto';
import { ApplyDiscountCodeDto } from './dto/ApplyDiscountCodeDto';
import { CartItemQuantityResponse } from '../../app/models/cart/CartItemQuantityResponse';
import { ShoppingCartItemResponse } from '../../app/models/cart/ShoppingCartItemResponse';
import { GetCartResponse } from '../../app/models/cart/GetCartResponse';
import { ApplyDiscountResponse } from '../../app/models/cart/ApplyDiscountResponse';

const root_path = 'cart';
const path_cart_items = '/items';
const path_remove_cart_item = path_cart_items + '/:itemId';
const path_update_cart_item_quantity =
	path_cart_items + '/:itemId/quantity/:quantityDelta';
const path_apply_discount = path_cart_items + '/:itemId/discount';

@ApiTags('cart')
@Controller(root_path)
export class CartShopController {
	constructor(
		private readonly addItemToCartUseCase: AddItemToCartUseCase,
		private readonly cleanCartUseCase: CleanCartUseCase,
		private readonly getCartByCustomerUseCase: GetCartByCustomerUseCase,
		private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
		private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
		private readonly applyDiscountCodeUseCase: ApplyDiscountCodeUseCase,
	) {}

	@Get('')
	@ApiOperation({
		summary: 'Obtener carrito de compras',
		description:
			'Recupera el carrito de compras completo del cliente con todos los items, precios y totales calculados',
	})
	@ApiQuery({
		name: 'customerId',
		description: 'ID del cliente (opcional si se proporciona customerEmail)',
		type: String,
		required: false,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiQuery({
		name: 'customerEmail',
		description: 'Email del cliente (opcional si se proporciona customerId)',
		type: String,
		required: false,
		example: 'customer@example.com',
	})
	@ApiResponse({
		status: 200,
		description: 'Carrito obtenido exitosamente',
		type: GetCartResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Cliente no encontrado',
	})
	async getCustomerCart(
		@Query('customerId') customerId?: string,
		@Query('customerEmail') customerEmail?: string,
	): Promise<GetCartResponse> {
		return this.getCartByCustomerUseCase.handle(customerId, customerEmail);
	}

	@Post(path_cart_items)
	@ApiOperation({
		summary: 'Agregar item al carrito',
		description:
			'Agrega un producto con una variante específica al carrito de compras del cliente',
	})
	@ApiQuery({
		name: 'customerId',
		description: 'ID del cliente (opcional si se proporciona customerEmail)',
		type: String,
		required: false,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiQuery({
		name: 'customerEmail',
		description: 'Email del cliente (opcional si se proporciona customerId)',
		type: String,
		required: false,
		example: 'customer@example.com',
	})
	@ApiBody({
		type: AddCartItemDto,
		description: 'Datos del item a agregar al carrito',
	})
	@ApiResponse({
		status: 201,
		description: 'Item agregado exitosamente al carrito',
		type: ShoppingCartItemResponse,
	})
	@ApiResponse({
		status: 400,
		description:
			'Datos inválidos, stock insuficiente o cantidad solicitada excede el stock disponible de la variante',
	})
	@ApiResponse({
		status: 404,
		description: 'Cliente o variante no encontrada',
	})
	async addItemToCart(
		@Query('customerId') customerId: string | undefined,
		@Query('customerEmail') customerEmail: string | undefined,
		@Body() body: AddCartItemDto,
	): Promise<ShoppingCartItemResponse> {
		return this.addItemToCartUseCase.handle(customerId, customerEmail, body);
	}

	@Delete('')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Limpiar carrito',
		description: 'Elimina todos los items del carrito de compras del cliente',
	})
	@ApiQuery({
		name: 'customerId',
		description: 'ID del cliente (opcional si se proporciona customerEmail)',
		type: String,
		required: false,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiQuery({
		name: 'customerEmail',
		description: 'Email del cliente (opcional si se proporciona customerId)',
		type: String,
		required: false,
		example: 'customer@example.com',
	})
	@ApiResponse({
		status: 204,
		description: 'Carrito limpiado exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Cliente no encontrado',
	})
	async cleanCart(
		@Query('customerId') customerId?: string,
		@Query('customerEmail') customerEmail?: string,
	): Promise<void> {
		return this.cleanCartUseCase.handle(customerId, customerEmail);
	}

	@Delete(path_remove_cart_item)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Eliminar item del carrito',
		description: 'Elimina un item específico del carrito de compras',
	})
	@ApiParam({
		name: 'itemId',
		description: 'ID del item en el carrito',
		type: String,
		example: '507f1f77bcf86cd799439012',
	})
	@ApiResponse({
		status: 204,
		description: 'Item eliminado exitosamente',
	})
	@ApiResponse({
		status: 404,
		description: 'Item no encontrado',
	})
	async removeItemFromCart(@Param('itemId') itemId: string): Promise<void> {
		return this.removeItemFromCartUseCase.handle(itemId);
	}

	@Patch(path_update_cart_item_quantity)
	@ApiOperation({
		summary: 'Actualizar cantidad del item',
		description: 'Incrementa o decrementa la cantidad de un item en el carrito',
	})
	@ApiParam({
		name: 'itemId',
		description: 'ID del item en el carrito',
		type: String,
		example: '507f1f77bcf86cd799439012',
	})
	@ApiParam({
		name: 'quantityDelta',
		description:
			'Cambio en la cantidad (positivo para incrementar, negativo para decrementar)',
		type: Number,
		example: 1,
	})
	@ApiResponse({
		status: 200,
		description: 'Cantidad actualizada exitosamente',
		type: CartItemQuantityResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Cantidad inválida o excede el stock disponible',
	})
	@ApiResponse({
		status: 404,
		description: 'Item no encontrado',
	})
	async updateCartItemQuantity(
		@Param('itemId') itemId: string,
		@Param('quantityDelta', ParseIntPipe) quantityDelta: number,
	): Promise<CartItemQuantityResponse> {
		return this.updateCartItemQuantityUseCase.handle(itemId, quantityDelta);
	}

	@Post(path_apply_discount)
	@ApiOperation({
		summary: 'Aplicar código de descuento',
		description:
			'Aplica un código de descuento a un item específico del carrito (solo para clientes registrados)',
	})
	@ApiParam({
		name: 'itemId',
		description: 'ID del item en el carrito',
		type: String,
		example: '507f1f77bcf86cd799439012',
	})
	@ApiBody({
		type: ApplyDiscountCodeDto,
		description: 'Código de descuento a aplicar',
	})
	@ApiResponse({
		status: 200,
		description: 'Descuento aplicado exitosamente',
		type: ApplyDiscountResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Código de descuento inválido o expirado',
	})
	@ApiResponse({
		status: 404,
		description: 'Item no encontrado',
	})
	async applyDiscountCode(
		@Param('itemId') itemId: string,
		@Body() body: ApplyDiscountCodeDto,
	): Promise<ApplyDiscountResponse> {
		return this.applyDiscountCodeUseCase.handle(itemId, body.code);
	}
}
