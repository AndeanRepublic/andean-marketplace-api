import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommunityResponse } from './CommunityResponse';

/** Respuesta completa para edición (banner, sellos, providerInfo). */
export class CommunityDetailResponse extends CommunityResponse {
	@ApiPropertyOptional({ description: 'ID del MediaItem del banner' })
	bannerImageId?: string;

	@ApiPropertyOptional({ description: 'URL pública del banner' })
	bannerImageUrl?: string;

	@ApiPropertyOptional({ type: [String], description: 'IDs de sellos asociados' })
	seals?: string[];

	@ApiPropertyOptional({
		description: 'Datos de perfil del proveedor (misma forma que en alta)',
		type: Object,
	})
	providerInfo?: Record<string, unknown>;
}
