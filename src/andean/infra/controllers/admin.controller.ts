import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CustomerProfile } from '../../domain/entities/CustomerProfile';
import { SellerProfile } from '../../domain/entities/SellerProfile';
import { GetAllCustomerUseCase } from '../../app/use_cases/users/GetAllCustomerUseCase';
import { GetAllSellersUseCase } from '../../app/use_cases/users/GetAllSellersUseCase';
import { UpdateAccountStatusUseCase } from '../../app/use_cases/users/UpdateAccountStatusUseCase';
import { UpdateAccountStatusDto } from './dto/UpdateAccountStatusDto';
import { RolesGuard } from '../core/roles.guard';
import { Roles } from '../core/roles.decorator';
import { AccountRole } from '../../domain/enums/AccountRole';
import { JwtAuthGuard } from '../core/jwtAuth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly getAllCustomerUseCase: GetAllCustomerUseCase,
    private readonly getAllSellersUseCase: GetAllSellersUseCase,
    private readonly updateAccountStatusUseCase: UpdateAccountStatusUseCase,
  ) {}

  @Get('/customers')
  async getAllCustomers(): Promise<CustomerProfile[]> {
    return this.getAllCustomerUseCase.handle();
  }

  @Get('/sellers')
  async getAllSellers(): Promise<SellerProfile[]> {
    return this.getAllSellersUseCase.handle();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.ADMIN)
  @Put('/account/:userId')
  async updateAccountStatus(
    @Param('userId') userId: string,
    @Body() body: UpdateAccountStatusDto,
  ): Promise<void> {
    return this.updateAccountStatusUseCase.handle(userId, body);
  }
}
