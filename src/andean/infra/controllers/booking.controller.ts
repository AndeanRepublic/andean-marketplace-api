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
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../core/jwtAuth.guard';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBody,
	ApiQuery,
} from '@nestjs/swagger';
import { CreateBookingUseCase } from '../../app/use_cases/bookings/CreateBookingUseCase';
import { CreatePayPalBookingOrderUseCase } from '../../app/use_cases/bookings/CreatePayPalBookingOrderUseCase';
import { CapturePayPalBookingUseCase } from '../../app/use_cases/bookings/CapturePayPalBookingUseCase';
import { GetBookingByIdUseCase } from '../../app/use_cases/bookings/GetBookingByIdUseCase';
import { GetBookingsByCustomerUseCase } from '../../app/use_cases/bookings/GetBookingsByCustomerUseCase';
import { GetBookingsByEmailUseCase } from '../../app/use_cases/bookings/GetBookingsByEmailUseCase';
import { UpdateBookingStatusUseCase } from '../../app/use_cases/bookings/UpdateBookingStatusUseCase';
import { CreateBookingDto } from './dto/booking/CreateBookingDto';
import { UpdateBookingDto } from './dto/booking/UpdateBookingDto';
import { Booking } from '../../domain/entities/booking/Booking';
import { BookingResponse } from '../../app/modules/booking/BookingResponse';
import { BookingErrorResponse } from '../../app/modules/booking/BookingErrorResponse';
import { CreatePayPalBookingOrderDto } from './dto/booking/CreatePayPalBookingOrderDto';
import { CapturePayPalBookingDto } from './dto/booking/CapturePayPalBookingDto';
import { CapturePayPalBookingResponse } from '../../app/use_cases/bookings/CapturePayPalBookingUseCase';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
	constructor(
		private readonly createBookingUseCase: CreateBookingUseCase,
		private readonly createPayPalBookingOrderUseCase: CreatePayPalBookingOrderUseCase,
		private readonly capturePayPalBookingUseCase: CapturePayPalBookingUseCase,
		private readonly getBookingByIdUseCase: GetBookingByIdUseCase,
		private readonly getBookingsByCustomerUseCase: GetBookingsByCustomerUseCase,
		private readonly getBookingsByEmailUseCase: GetBookingsByEmailUseCase,
		private readonly updateBookingStatusUseCase: UpdateBookingStatusUseCase,
	) {}

	@Post('')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear booking',
		description: 'Crea una nueva reserva con la información proporcionada',
	})
	@ApiBody({ type: CreateBookingDto })
	@ApiResponse({
		status: 201,
		description: 'Booking creado exitosamente',
		type: BookingResponse,
	})
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiResponse({
		status: 409,
		description:
			'Las fechas seleccionadas no están disponibles. Ya existe una reserva para esta experiencia en ese período.',
		type: BookingErrorResponse,
	})
	async createBooking(@Body() body: CreateBookingDto): Promise<Booking> {
		return this.createBookingUseCase.handle(body);
	}

	@Post('/paypal/create-order')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Crear orden PayPal para booking',
		description:
			'Crea una orden de pago en PayPal para un booking y retorna el orderId',
	})
	@ApiBody({ type: CreatePayPalBookingOrderDto })
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
	async createPayPalBookingOrder(
		@Body() body: CreatePayPalBookingOrderDto,
	): Promise<{ orderId: string }> {
		return this.createPayPalBookingOrderUseCase.handle(body);
	}

	@Post('/paypal/capture-order')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Capturar orden PayPal y crear booking',
		description:
			'Captura una orden de PayPal después de que el usuario la aprueba y crea el booking',
	})
	@ApiBody({ type: CapturePayPalBookingDto })
	@ApiResponse({
		status: 200,
		description: 'Orden capturada y booking creado exitosamente',
		schema: {
			type: 'object',
			properties: {
				success: { type: 'boolean', example: true },
				orderId: { type: 'string', example: '5O190127TN364715T' },
				status: { type: 'string', example: 'COMPLETED' },
				transactionId: { type: 'string', example: '8F148899LY528414L' },
				booking: { type: 'object' },
			},
		},
	})
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiResponse({ status: 404, description: 'Experience not found' })
	async capturePayPalBookingOrder(
		@Body() body: CapturePayPalBookingDto,
	): Promise<CapturePayPalBookingResponse> {
		return this.capturePayPalBookingUseCase.handle(body);
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Obtener booking por ID',
		description: 'Recupera un booking específico por su ID',
	})
	@ApiParam({
		name: 'id',
		description: 'ID del booking',
		type: String,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiResponse({
		status: 200,
		description: 'Booking encontrado exitosamente',
		type: BookingResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Booking not found',
		type: BookingErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid booking ID',
		type: BookingErrorResponse,
	})
	async getById(@Param('id') id: string): Promise<Booking> {
		return this.getBookingByIdUseCase.handle(id);
	}

	@Get('/by-customer/:customerId')
	@ApiOperation({
		summary: 'Obtener bookings por cliente',
		description: 'Recupera todos los bookings de un cliente específico',
	})
	@ApiParam({
		name: 'customerId',
		description: 'ID del cliente',
		type: String,
		example: '507f191e810c19729de860ea',
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de bookings del cliente obtenida exitosamente',
		type: [BookingResponse],
	})
	@ApiResponse({
		status: 404,
		description: 'Customer not found',
		type: BookingErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid customer ID',
		type: BookingErrorResponse,
	})
	async getByCustomerId(
		@Param('customerId') customerId: string,
	): Promise<Booking[]> {
		return this.getBookingsByCustomerUseCase.handle(customerId);
	}

	@Get('/by-email')
	@ApiOperation({
		summary: 'Obtener bookings por email',
		description:
			'Recupera todos los bookings de un cliente por su email (para guest bookings)',
	})
	@ApiQuery({
		name: 'email',
		description: 'Email del cliente',
		type: String,
		required: true,
	})
	@ApiResponse({
		status: 200,
		description: 'Lista de bookings obtenida exitosamente',
		type: [BookingResponse],
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid or missing email',
		type: BookingErrorResponse,
	})
	async getByEmail(@Query('email') email: string): Promise<Booking[]> {
		return this.getBookingsByEmailUseCase.handle(email);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(AccountRole.ADMIN)
	@Put('/:id/status')
	@ApiOperation({
		summary: 'Actualizar estado del booking',
		description: 'Cambia el estado de un booking existente',
	})
	@ApiParam({
		name: 'id',
		description: 'ID del booking',
		type: String,
		example: '507f1f77bcf86cd799439011',
	})
	@ApiBody({ type: UpdateBookingDto })
	@ApiResponse({
		status: 200,
		description: 'Estado del booking actualizado exitosamente',
		type: BookingResponse,
	})
	@ApiResponse({
		status: 404,
		description: 'Booking not found',
		type: BookingErrorResponse,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid booking ID or invalid booking status',
		type: BookingErrorResponse,
	})
	async updateStatus(
		@Param('id') id: string,
		@Body() body: UpdateBookingDto,
	): Promise<Booking> {
		return this.updateBookingStatusUseCase.handle(id, body);
	}
}
