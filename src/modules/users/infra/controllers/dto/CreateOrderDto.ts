import { OrderItem } from '../../../domain/entities/OrderItem';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
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
  totalAmount: number;

  @IsString()
  @IsEnum(PaymentMethod)
  paymentMethod: string;
}
