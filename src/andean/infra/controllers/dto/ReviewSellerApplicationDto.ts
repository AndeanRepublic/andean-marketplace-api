import {
	IsEnum,
	IsNotEmpty,
	IsString,
	MaxLength,
	ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SellerApplicationDecision } from '../../../domain/enums/SellerApplicationDecision';

export class ReviewSellerApplicationDto {
	@ApiProperty({
		description: 'Decisión de revisión de la solicitud de vendedor',
		enum: SellerApplicationDecision,
	})
	@IsEnum(SellerApplicationDecision)
	@IsNotEmpty()
	decision!: SellerApplicationDecision;

	@ApiPropertyOptional({
		description: 'Motivo del rechazo (obligatorio si decision es REJECTED)',
		example: 'La documentación enviada no es válida.',
	})
	@ValidateIf((o) => o.decision === SellerApplicationDecision.REJECTED)
	@IsNotEmpty({ message: 'rejectionReason is required when decision is REJECTED' })
	@IsString()
	@MaxLength(2000)
	rejectionReason?: string;
}
