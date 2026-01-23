import { Controller, Get, Param, Post, Delete, Body, Patch, ParseIntPipe } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
} from '@nestjs/swagger';
import { AddItemToCartUseCase } from '../../app/use_cases/cart_shop/AddItemToCartUseCase';
import { CleanCartUseCase } from '../../app/use_cases/cart_shop/CleanCartUseCase';
import { GetCartByCustomerUseCase } from '../../app/use_cases/cart_shop/GetCartByCustomerUseCase';
import { RemoveItemFromCartUseCase } from '../../app/use_cases/cart_shop/RemoveItemFromCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../app/use_cases/cart_shop/UpdateCartItemQuantityUseCase';
import { ApplyDiscountCodeUseCase } from '../../app/use_cases/cart_shop/ApplyDiscountCodeUseCase';
import { CartShop } from '../../domain/entities/CartShop';
import { AddCartItemDto } from './dto/AddCartItemDto';
import { ApplyDiscountCodeDto } from './dto/ApplyDiscountCodeDto';
import { CartItemQuantityResponse } from '../../app/models/cart/CartItemQuantityResponse';
import { ApplyDiscountResponse } from '../../app/models/cart/ApplyDiscountResponse';

const root_path = 'users/customers/:userId/cart';
const path_cart_items = '/items';
const path_remove_cart_item = path_cart_items + '/:itemId';
const path_update_cart_item_quantity = path_cart_items + '/:itemId/quantity/:quantityDelta';
const path_apply_discount = path_cart_items + '/:itemId/discount';

@ApiTags('Shopping Cart')
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

  @Patch(path_update_cart_item_quantity)
  @ApiOperation({
    summary: 'Actualizar cantidad de un item del carrito',
    description:
      'Incrementa o decrementa la cantidad de un item en el carrito de compras. El parámetro quantityDelta puede ser positivo (incrementar) o negativo (decrementar). La cantidad mínima es 0. Retorna la cantidad actualizada, el ID del item y el stock máximo disponible.',
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID del item del carrito a actualizar',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @ApiParam({
    name: 'quantityDelta',
    description:
      'Cantidad a incrementar (positivo) o decrementar (negativo). Por defecto es +1 si no se especifica.',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad actualizada exitosamente',
    type: CartItemQuantityResponse,
  })
  @ApiResponse({
    status: 400,
    description:
      'Error de validación: cantidad resultante sería negativa o excede el stock disponible',
  })
  @ApiResponse({
    status: 404,
    description: 'Item del carrito no encontrado',
  })
  async updateCartItemQuantity(
    @Param('itemId') itemId: string,
    @Param('quantityDelta', ParseIntPipe) quantityDelta: number,
  ): Promise<CartItemQuantityResponse> {
    return this.updateCartItemQuantityUseCase.handle(itemId, quantityDelta);
  }

  @Post(path_apply_discount)
  @ApiOperation({
    summary: 'Aplicar código de descuento a un item del carrito',
    description:
      'Aplica un código de descuento generado por el juego a un item específico del carrito. El código se valida mediante una API externa que determina el porcentaje de descuento (3%, 7% o 11%). Solo se puede aplicar un descuento por carrito (si otro item ya tiene descuento, se retornará un error). El descuento se calcula sobre el precio unitario del item.',
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID del item del carrito al que se aplicará el descuento',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @ApiBody({
    type: ApplyDiscountCodeDto,
    description: 'Código de descuento generado por el juego',
  })
  @ApiResponse({
    status: 200,
    description: 'Descuento aplicado exitosamente',
    type: ApplyDiscountResponse,
  })
  @ApiResponse({
    status: 400,
    description:
      'Error de validación: código inválido, otro item del carrito ya tiene descuento, o el código no es válido según la API externa',
  })
  @ApiResponse({
    status: 404,
    description: 'Item del carrito no encontrado',
  })
  async applyDiscountCode(
    @Param('itemId') itemId: string,
    @Body() body: ApplyDiscountCodeDto,
  ): Promise<ApplyDiscountResponse> {
    return this.applyDiscountCodeUseCase.handle(itemId, body.code);
  }
}
