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
	UseGuards,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
	ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { CurrentUser } from '../core/current-user.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
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

	@UseGuards(JwtAuthGuard)
	@Get('')
	@ApiOperation({
		summary: 'Obtener carrito de compras',
		description:
			'Recupera el carrito de compras completo del cliente con todos los items, precios y totales calculados (solo usuarios logueados)',
	})
	@ApiQuery({
		name: 'targetCustomerId',
		required: false,
		description: 'ADMIN only — operate on a specific customer cart',
		type: String,
	})
	@ApiResponse({
		status: 200,
		description: 'Carrito obtenido exitosamente',
		type: GetCartResponse,
	})
	@ApiResponse({
		status: 401,
		description: 'No autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'Acceso denegado',
	})
	@ApiResponse({
		status: 404,
		description: 'Cliente no encontrado',
	})
	async getCustomerCart(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Query('targetCustomerId') targetCustomerId?: string,
	): Promise<GetCartResponse> {
		return this.getCartByCustomerUseCase.handle(
			user.userId,
			user.roles,
			targetCustomerId,
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post(path_cart_items)
	@ApiOperation({
		summary: 'Agregar item al carrito',
		description:
			'Agrega un producto con una variante específica al carrito de compras del cliente (solo usuarios logueados)',
	})
	@ApiQuery({
		name: 'targetCustomerId',
		required: false,
		description: 'ADMIN only — operate on a specific customer cart',
		type: String,
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
		status: 401,
		description: 'No autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'Acceso denegado',
	})
	@ApiResponse({
		status: 404,
		description: 'Cliente o variante no encontrada',
	})
	async addItemToCart(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Body() body: AddCartItemDto,
		@Query('targetCustomerId') targetCustomerId?: string,
	): Promise<ShoppingCartItemResponse> {
		return this.addItemToCartUseCase.handle(
			user.userId,
			user.roles,
			body,
			targetCustomerId,
		);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Limpiar carrito',
		description:
			'Elimina todos los items del carrito de compras del cliente (solo usuarios logueados)',
	})
	@ApiQuery({
		name: 'targetCustomerId',
		required: false,
		description: 'ADMIN only — operate on a specific customer cart',
		type: String,
	})
	@ApiResponse({
		status: 204,
		description: 'Carrito limpiado exitosamente',
	})
	@ApiResponse({
		status: 401,
		description: 'No autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'Acceso denegado',
	})
	@ApiResponse({
		status: 404,
		description: 'Cliente no encontrado',
	})
	async cleanCart(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Query('targetCustomerId') targetCustomerId?: string,
	): Promise<void> {
		return this.cleanCartUseCase.handle(
			user.userId,
			user.roles,
			targetCustomerId,
		);
	}

	@UseGuards(JwtAuthGuard)
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
		status: 401,
		description: 'No autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'Acceso denegado',
	})
	@ApiResponse({
		status: 404,
		description: 'Item no encontrado',
	})
	async removeItemFromCart(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Param('itemId') itemId: string,
	): Promise<void> {
		return this.removeItemFromCartUseCase.handle(
			itemId,
			user.userId,
			user.roles,
		);
	}

	@UseGuards(JwtAuthGuard)
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
		status: 401,
		description: 'No autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'Acceso denegado',
	})
	@ApiResponse({
		status: 404,
		description: 'Item no encontrado',
	})
	async updateCartItemQuantity(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Param('itemId') itemId: string,
		@Param('quantityDelta', ParseIntPipe) quantityDelta: number,
	): Promise<CartItemQuantityResponse> {
		return this.updateCartItemQuantityUseCase.handle(
			itemId,
			quantityDelta,
			user.userId,
			user.roles,
		);
	}

	@UseGuards(JwtAuthGuard)
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
		status: 401,
		description: 'No autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'Acceso denegado',
	})
	@ApiResponse({
		status: 404,
		description: 'Item no encontrado',
	})
	async applyDiscountCode(
		@CurrentUser() user: { userId: string; roles: AccountRole[] },
		@Param('itemId') itemId: string,
		@Body() body: ApplyDiscountCodeDto,
	): Promise<ApplyDiscountResponse> {
		return this.applyDiscountCodeUseCase.handle(
			itemId,
			body.code,
			user.userId,
			user.roles,
		);
	}
}
