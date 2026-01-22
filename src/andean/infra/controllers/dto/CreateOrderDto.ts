import { OrderItem } from '../../../domain/entities/OrderItem';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ArrayNotEmpty()
  items: OrderItem[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  totalAmount: number;

  @IsString()
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  deliveryCost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  taxOrFee?: number;
}
