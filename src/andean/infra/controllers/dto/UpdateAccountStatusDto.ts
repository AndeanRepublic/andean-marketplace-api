import { Injectable } from '@nestjs/common';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountStatus } from '../../../domain/enums/AccountStatus';

@Injectable()
export class UpdateAccountStatusDto {
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;
}
