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
import { CreateBookingUseCase } from '../../app/use_cases/bookings/CreateBookingUseCase';
import { GetBookingByIdUseCase } from '../../app/use_cases/bookings/GetBookingByIdUseCase';
import { GetBookingsByCustomerUseCase } from '../../app/use_cases/bookings/GetBookingsByCustomerUseCase';
import { GetBookingsByEmailUseCase } from '../../app/use_cases/bookings/GetBookingsByEmailUseCase';
import { UpdateBookingStatusUseCase } from '../../app/use_cases/bookings/UpdateBookingStatusUseCase';
import { CreateBookingDto } from './dto/booking/CreateBookingDto';
import { UpdateBookingDto } from './dto/booking/UpdateBookingDto';
import { Booking } from '../../domain/entities/booking/Booking';
import { BookingResponse } from '../../app/models/booking/BookingResponse';
import { BookingErrorResponse } from '../../app/models/booking/BookingErrorResponse';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
	constructor(
		private readonly createBookingUseCase: CreateBookingUseCase,
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
	async createBooking(@Body() body: CreateBookingDto): Promise<Booking> {
		return this.createBookingUseCase.handle(body);
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
		description: 'Recupera todos los bookings de un cliente por su email (para guest bookings)',
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
