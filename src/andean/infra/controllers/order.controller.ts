import {
	Body,
	Controller,
	Get,
	Post,
	Param,
	Put,
	Query,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
	ApiQuery,
} from '@nestjs/swagger';
import { CreateOrderUseCase } from '../../app/use_cases/orders/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../app/use_cases/orders/GetOrderByIdUseCase';
import { GetOrdersByCustomerUseCase } from '../../app/use_cases/orders/GetOrdersByCustomerUseCase';
import { UpdateOrderStatusUseCase } from '../../app/use_cases/orders/UpdateOrderStatusUseCase';
import { CreateOrderFromCartUseCase } from '../../app/use_cases/orders/CreateOrderFromCartUseCase';
import { CreateOrderDto } from './dto/order/CreateOrderDto';
import { CreateOrderFromCartDto } from './dto/order/CreateOrderFromCartDto';
import { Order } from '../../domain/entities/order/Order';
import { UpdateOrderDto } from './dto/order/UpdateOrderDto';
import { OrderResponse } from '../../app/models/order/OrderResponse';
import { OrderErrorResponse } from '../../app/models/order/OrderErrorResponse';
import { CreatePayPalOrderUseCase } from '../../app/use_cases/payments/CreatePayPalOrderUseCase';
import { CapturePayPalOrderUseCase } from '../../app/use_cases/payments/CapturePayPalOrderUseCase';
import { CreatePayPalOrderDto } from './dto/payment/CreatePayPalOrderDto';
import { CapturePayPalOrderDto } from './dto/payment/CapturePayPalOrderDto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
	constructor(
		private readonly createOrderUseCase: CreateOrderUseCase,
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly getOrdersByCustomerUseCase: GetOrdersByCustomerUseCase,
		private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
		private readonly createOrderFromCartUseCase: CreateOrderFromCartUseCase,
		private readonly createPayPalOrderUseCase: CreatePayPalOrderUseCase,
		private readonly capturePayPalOrderUseCase: CapturePayPalOrderUseCase,
	) {}

	@Post('')
	@ApiOperation({
		summary: 'Crear orden',
		description: 'Crea una nueva orden con la información proporcionada',
	})
	@ApiBody({ type: CreateOrderDto })
	@ApiResponse({
		status: 201,
		description: 'Orden creada exitosamente',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	async createOrder(@Body() body: CreateOrderDto): Promise<Order> {
		return this.createOrderUseCase.handle(body);
	}

	@Post('/from-cart')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear orden desde carrito',
		description: 'Crea una orden a partir del carrito del cliente',
	})
	@ApiQuery({
		name: 'customerId',
		description: 'ID del cliente (opcional si se proporciona customerEmail)',
		type: String,
		required: false,
	})
	@ApiQuery({
		name: 'customerEmail',
		description: 'Email del cliente (opcional si se proporciona customerId)',
		type: String,
		required: false,
	})
	@ApiBody({ type: CreateOrderFromCartDto })
	@ApiResponse({
		status: 201,
		description: 'Orden creada exitosamente desde el carrito',
		type: Order,
	})
	@ApiResponse({ status: 400, description: 'Carrito vacío o datos inválidos' })
	@ApiResponse({ status: 404, description: 'Carrito no encontrado' })
	async createOrderFromCart(
		@Query('customerId') customerId: string | undefined,
		@Query('customerEmail') customerEmail: string | undefined,
		@Body() body: CreateOrderFromCartDto,
	): Promise<Order> {
		return this.createOrderFromCartUseCase.handle(
			customerId,
			customerEmail,
			body,
		);
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener orden por ID',
		description: 'Recupera una orden específica por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la orden',
		type: String,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Orden encontrada exitosamente',
		type: OrderResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Order not found',
		type: OrderErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid order ID',
		type: OrderErrorResponse,
	})
	async getById(@Param('id') id: string): Promise<Order> {
		return this.getOrderByIdUseCase.handle(id);
	}

	@Get('/by-customer/:customerId')
	@ApiOperation({
		summary: 'Obtener órdenes por cliente',
		description: 'Recupera todas las órdenes de un cliente específico',
	})
	@ApiParam({
		name: 'customerId',
		description: 'ID del cliente',
		type: String,
		example: '507f191e810c19729de860ea',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de órdenes del cliente obtenida exitosamente',
		type: [OrderResponse],
	})
	@ApiResponse({
		status: 404,
		description: 'Customer not found',
		type: OrderErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid customer ID',
		type: OrderErrorResponse,
	})
	async getByCustomerId(
		@Param('customerId') customerId: string,
	): Promise<Order[]> {
		return this.getOrdersByCustomerUseCase.handle(customerId);
	}

	@Put('/:id/status')
	@ApiOperation({
		summary: 'Actualizar estado de la orden',
		description: 'Cambia el estado de una orden existente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID de la orden',
		type: String,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiBody({ type: UpdateOrderDto })
	@ApiResponse({
		status: 200,
		description: 'Estado de la orden actualizado exitosamente',
		type: OrderResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Order not found',
		type: OrderErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid order ID or invalid order status',
		type: OrderErrorResponse,
	})
	async updateById(
		@Param('id') id: string,
		@Body() body: UpdateOrderDto,
	): Promise<Order> {
		return this.updateOrderStatusUseCase.handle(id, body);
	}

	@Post('/paypal/create-order')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear orden de PayPal',
		description: 'Crea una orden de pago en PayPal y retorna el orderId',
	})
	@ApiBody({ type: CreatePayPalOrderDto })
	@ApiResponse({
		status: 201,
		description: 'Orden de PayPal creada exitosamente',
		schema: {
			type: 'object',
			properties: {
				orderId: {
					type: 'string',
					example: '5O190127TN364715T',
				},
			},
		},
	})
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	async createPayPalOrder(
		@Body() body: CreatePayPalOrderDto,
	): Promise<{ orderId: string }> {
		return this.createPayPalOrderUseCase.handle(body);
	}

	@Post('/paypal/capture-order')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Capturar orden de PayPal',
		description:
			'Captura una orden de PayPal después de que el usuario la aprueba',
	})
	@ApiBody({ type: CapturePayPalOrderDto })
	@ApiResponse({
		status: 200,
		description: 'Orden de PayPal capturada exitosamente',
		schema: {
			type: 'object',
			properties: {
				success: {
					type: 'boolean',
					example: true,
				},
				orderId: {
					type: 'string',
					example: '5O190127TN364715T',
				},
				status: {
					type: 'string',
					example: 'COMPLETED',
				},
				transactionId: {
					type: 'string',
					example: '8F148899LY528414L',
				},
			},
		},
	})
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	async capturePayPalOrder(@Body() body: CapturePayPalOrderDto): Promise<{
		success: boolean;
		orderId: string;
		status: string;
		transactionId?: string;
	}> {
		return this.capturePayPalOrderUseCase.handle(body);
	}
}
