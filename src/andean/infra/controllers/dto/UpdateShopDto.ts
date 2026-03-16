import { PartialType } from '@nestjs/swagger';
import { CreateShopDto } from './CreateShopDto';

export class UpdateShopDto extends PartialType(CreateShopDto) {}
