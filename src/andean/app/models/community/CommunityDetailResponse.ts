import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommunityResponse } from './CommunityResponse';

/** Respuesta completa para edición (banner, sellos, providerInfo, pageInfo). */
export class CommunityDetailResponse extends CommunityResponse {
	@ApiPropertyOptional({ type: [String], description: 'IDs de sellos asociados' })
	seals?: string[];

	@ApiPropertyOptional({
		description: 'Datos de perfil del proveedor (misma forma que en alta)',
		type: Object,
	})
	providerInfo?: Record<string, unknown>;

	@ApiPropertyOptional({
		description: 'Datos de la página pública de la comunidad',
		type: Object,
	})
	pageInfo?: Record<string, unknown>;
}
