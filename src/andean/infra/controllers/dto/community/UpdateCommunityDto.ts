import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCommunityDto } from './CreateCommunityDto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProviderInfoDto } from '../providerInfo/CreateProviderInfoDto';

export class UpdateCommunityDto extends PartialType(CreateCommunityDto) {
	@ApiPropertyOptional({
		type: CreateProviderInfoDto,
		description: 'Datos del perfil del proveedor de la comunidad',
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProviderInfoDto)
	providerInfo?: CreateProviderInfoDto;
}
