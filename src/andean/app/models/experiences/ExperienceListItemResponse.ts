import { ApiProperty } from '@nestjs/swagger';
import { ExperienceStatus } from '../../../domain/enums/ExperienceStatus';

export class ExperienceMainImageResponse {
	@ApiProperty({ description: 'Nombre del archivo de imagen' })
	name!: string;

	@ApiProperty({ description: 'URL/key de la imagen' })
	url!: string;
}

export class ExperienceListItem {
	@ApiProperty({ description: 'ID de la experiencia' })
	id!: string;

	@ApiProperty({ description: 'Título de la experiencia' })
	title!: string;

	@ApiProperty({ description: 'Nombre del propietario (comunidad)' })
	ownerName!: string;

	@ApiProperty({ description: 'Precio del grupo ADULTS' })
	price!: number;

	@ApiProperty({ description: 'Ubicación de la experiencia' })
	place!: string;

	@ApiProperty({ description: 'Número de días' })
	days!: number;

	@ApiProperty({ description: 'Estado de la experiencia', enum: ExperienceStatus })
	status!: ExperienceStatus;

	@ApiProperty({ description: 'Imagen principal', type: ExperienceMainImageResponse })
	mainImage!: ExperienceMainImageResponse;
}

export class ExperiencePaginationInfo {
	@ApiProperty({ description: 'Total de experiencias encontradas', example: 150 })
	total!: number;

	@ApiProperty({ description: 'Página actual', example: 1 })
	page!: number;

	@ApiProperty({ description: 'Cantidad por página', example: 20 })
	per_page!: number;
}

export class PaginatedExperiencesResponse {
	@ApiProperty({ description: 'Lista de experiencias', type: [ExperienceListItem] })
	experiences!: ExperienceListItem[];

	@ApiProperty({ description: 'Información de paginación', type: ExperiencePaginationInfo })
	pagination!: ExperiencePaginationInfo;
}
