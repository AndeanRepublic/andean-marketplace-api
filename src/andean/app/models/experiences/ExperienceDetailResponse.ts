import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaItemType } from 'src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { ExperienceLanguage } from 'src/andean/domain/enums/ExperienceLanguage';
import { WeekDay } from 'src/andean/domain/enums/WeekDay';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';

// ─── MediaItem Detail (full info) ───────────────────────────────────────

export class MediaItemFullDetail {
	@ApiProperty({
		description: 'ID único del MediaItem',
		example: 'media-landscape-001',
	})
	id!: string;

	@ApiProperty({
		description: 'Tipo del archivo multimedia',
		enum: MediaItemType,
		example: MediaItemType.IMG,
	})
	type!: MediaItemType;

	@ApiProperty({
		description: 'Nombre del archivo',
		example: 'landscape-valle-sagrado.jpg',
	})
	name!: string;

	@ApiProperty({
		description: 'URL completa construida con STORAGE_BASE_URL + key',
		example:
			'https://storage.example.com/experiences/landscape-valle-sagrado.jpg',
	})
	url!: string;

	@ApiProperty({
		description: 'Rol del archivo multimedia dentro del producto',
		enum: MediaItemRole,
		example: MediaItemRole.PRINCIPAL,
	})
	role!: MediaItemRole;

	@ApiProperty({
		description: 'Key/path del archivo dentro del bucket de storage',
		example: 'experiences/landscape-valle-sagrado.jpg',
	})
	key!: string;

	@ApiPropertyOptional({
		description: 'Fecha de creación del archivo',
		example: '2026-01-15T00:00:00.000Z',
	})
	createdAt?: Date;
}

// ─── HeroDetail ────────────────────────────────────────────────────────────

export class HeroDetailResponse {
	@ApiProperty({
		description: 'Título de la experiencia',
		example: 'Trekking al Valle Sagrado',
	})
	title!: string;

	@ApiProperty({
		description: 'Descripción corta de la experiencia',
		example: 'Una experiencia única en los Andes peruanos',
	})
	shortDescription!: string;

	@ApiProperty({
		description: 'Descripción larga y detallada de la experiencia',
		example: 'Recorre senderos milenarios a través de comunidades quechuas...',
	})
	largeDescription!: string;

	@ApiProperty({
		description: 'Número de días de la experiencia',
		example: 3,
	})
	days!: number;

	@ApiProperty({
		description: 'Número de noches de la experiencia',
		example: 2,
	})
	nights!: number;

	@ApiProperty({
		description: 'Precio del grupo ADULTS (o el único disponible)',
		example: 120,
	})
	price!: number;

	@ApiProperty({
		description: 'URL completa de la imagen panorámica principal',
		example:
			'https://storage.example.com/experiences/landscape-valle-sagrado.jpg',
	})
	landscapeImgUrl!: string;

	@ApiProperty({
		description:
			'Lista de fotos resueltas con toda la información del MediaItem',
		type: [MediaItemFullDetail],
	})
	photos!: MediaItemFullDetail[];

	@ApiProperty({
		description: 'ID del propietario (comunidad o tienda)',
		example: 'community-001',
	})
	ownerId!: string;

	@ApiProperty({
		description: 'Tipo de propietario',
		enum: OwnerType,
		example: OwnerType.COMMUNITY,
	})
	ownerType!: OwnerType;

	@ApiProperty({
		description: 'Nombre/título del propietario (comunidad o tienda)',
		example: 'Comunidad Quechua del Valle',
	})
	ownerTitle!: string;

	@ApiProperty({
		description:
			'URL de la imagen del propietario (banner de comunidad o logo de tienda)',
		example: 'https://storage.example.com/communities/banner-quechua.jpg',
	})
	ownerImgUrl!: string;
}

// ─── Information ───────────────────────────────────────────────────────────

export class InformationResponse {
	@ApiProperty({
		description:
			'Edad mínima permitida (calculada del menor minAge de ageGroups)',
		example: 5,
	})
	minAge!: number;

	@ApiProperty({
		description:
			'Edad máxima permitida (calculada del mayor maxAge de ageGroups)',
		example: 65,
	})
	maxAge!: number;

	@ApiProperty({
		description: 'Duración de la experiencia en días',
		example: 3,
	})
	duration!: number;

	@ApiProperty({
		description: 'Idiomas disponibles para la experiencia',
		enum: ExperienceLanguage,
		isArray: true,
		example: [ExperienceLanguage.ESPAÑOL, ExperienceLanguage.ENGLISH],
	})
	languages!: ExperienceLanguage[];
}

// ─── Availability ───────────────────────────────────────────────────────────
export class ExperienceAvailabilityResponse {
	@ApiProperty({
		description:
			'Días de la semana en que inicia (0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday)',
		enum: WeekDay,
		isArray: true,
		example: [WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY],
	})
	weeklyStartDays!: WeekDay[];

	@ApiProperty({
		description: 'Fechas específicas disponibles',
		type: [Date],
		example: ['2026-03-15', '2026-04-01'],
	})
	specificAvailableDates!: Date[];

	@ApiProperty({
		description: 'Fechas excluidas',
		type: [Date],
		example: ['2026-03-20'],
	})
	excludedDates!: Date[];
}

export class AgeGroupPricingResponse {
	@ApiProperty({
		description: 'Etiqueta',
		example: 'Adultos',
	})
	label!: string;

	@ApiProperty({
		description: 'Precio',
		example: 100,
	})
	price!: number;

	@ApiPropertyOptional({
		description: 'Edad mínima',
		example: 26,
	})
	minAge?: number;

	@ApiPropertyOptional({
		description: 'Edad máxima',
		example: 60,
	})
	maxAge?: number;
}

// ─── AgePricingInfo ───────────────────────────────────────────────────────

export class AgePricingInfoResponse {
	@ApiProperty({
		description: 'Usa precios basados en edad',
		type: Boolean,
	})
	useAgeBasedPricing!: boolean;

	@ApiProperty({
		description: 'Moneda',
		example: 'USD',
	})
	currency!: string;

	@ApiProperty({
		description: 'Grupos de edad con precios',
		type: [AgeGroupPricingResponse],
	})
	ageGroups!: AgeGroupPricingResponse[];
}
// ─── QuestionSection ───────────────────────────────────────────────────────

export class QuestionSectionResponse {
	@ApiProperty({
		description: 'Lo que incluye la experiencia (lista separada por comas)',
		example: 'Transporte desde Cusco, Almuerzo tradicional, Guía bilingüe',
	})
	includes!: string;

	@ApiPropertyOptional({
		description: 'Lista de cosas que el participante debe llevar',
		type: [String],
		example: [
			'Protector solar',
			'Agua',
			'Ropa abrigadora',
			'Zapatos de trekking',
		],
	})
	shouldCarry?: string[];

	@ApiProperty({
		description: 'Detalle del punto de recogida',
		example: 'Hotel en Cusco a las 6:00 AM',
	})
	pickupDetail!: string;

	@ApiProperty({
		description: 'Detalle del retorno',
		example: 'Retorno al hotel a las 6:00 PM del último día',
	})
	returnDetail!: string;

	@ApiProperty({
		description: 'Detalle del alojamiento',
		example: 'Hospedaje en casa comunal con servicios básicos',
	})
	accommodationDetail!: string;

	@ApiProperty({
		description: 'Detalle de accesibilidad y nivel de dificultad',
		example: 'Nivel de dificultad moderado, requiere buena condición física',
	})
	accessibilityDetail!: string;

	@ApiPropertyOptional({
		description: 'Información adicional relevante',
		type: [String],
		example: ['Altitud máxima: 4200 msnm', 'Se recomienda aclimatación previa'],
	})
	aditionalInformation?: string[];

	@ApiProperty({
		description: 'Política de cancelación',
		example: 'Cancelación gratuita hasta 48 horas antes del inicio',
	})
	cancellationPolicy!: string;

	@ApiPropertyOptional({
		description: 'Número de contacto',
		example: '+51 984 123 456',
	})
	contactNumber?: string;
}

// ─── Itinerary ─────────────────────────────────────────────────────────────

export class ItineraryScheduleResponse {
	@ApiProperty({
		description: 'Hora de la actividad',
		example: '06:00',
	})
	time!: string;

	@ApiProperty({
		description: 'Descripción de la actividad',
		example: 'Recogida del hotel',
	})
	activity!: string;
}

export class ItineraryItemResponse {
	@ApiProperty({
		description: 'Número del día en el itinerario',
		example: 1,
	})
	numberDay!: number;

	@ApiProperty({
		description: 'Nombre/título del día',
		example: 'Día de llegada - Cusco a Ollantaytambo',
	})
	nameDay!: string;

	@ApiProperty({
		description: 'Descripción del día',
		example:
			'Viaje desde Cusco hasta Ollantaytambo, pasando por el mercado de Pisac.',
	})
	descriptionDay!: string;

	@ApiProperty({
		description:
			'Fotos del día resueltas con toda la información del MediaItem',
		type: [MediaItemFullDetail],
	})
	photos!: MediaItemFullDetail[];

	@ApiProperty({
		description: 'Horario de actividades del día',
		type: [ItineraryScheduleResponse],
	})
	schedule!: ItineraryScheduleResponse[];
}

// ─── Review ────────────────────────────────────────────────────────────────

export class ReviewRatingResponse {
	@ApiProperty({
		description: 'Cantidad de reseñas con 5 estrellas',
		example: 10,
	})
	count5stars!: number;

	@ApiProperty({
		description: 'Cantidad de reseñas con 4 estrellas',
		example: 5,
	})
	count4stars!: number;

	@ApiProperty({
		description: 'Cantidad de reseñas con 3 estrellas',
		example: 2,
	})
	count3stars!: number;

	@ApiProperty({
		description: 'Cantidad de reseñas con 2 estrellas',
		example: 1,
	})
	count2stars!: number;

	@ApiProperty({
		description: 'Cantidad de reseñas con 1 estrella',
		example: 0,
	})
	count1star!: number;

	@ApiProperty({ description: 'Total de reseñas', example: 18 })
	totalReviews!: number;

	@ApiProperty({
		description: 'Puntuación promedio (redondeada a 1 decimal)',
		example: 4.3,
	})
	averagePunctuation!: number;
}

export class ReviewCommentResponse {
	@ApiProperty({ description: 'ID de la reseña', example: 'review-001' })
	idReview!: string;

	@ApiProperty({
		description: 'Nombre del usuario que realizó la reseña',
		example: 'Juan Pérez',
	})
	nameUser!: string;

	@ApiProperty({
		description: 'Contenido de la reseña',
		example: 'Excelente experiencia, muy recomendable!',
	})
	content!: string;

	@ApiProperty({ description: 'Cantidad de estrellas (1-5)', example: 5 })
	numberStarts!: number;

	@ApiProperty({
		description: 'Fecha de la reseña',
		example: '2026-01-20T00:00:00.000Z',
	})
	date!: Date;

	@ApiProperty({ description: 'Cantidad de likes', example: 12 })
	likes!: number;

	@ApiProperty({ description: 'Cantidad de dislikes', example: 1 })
	dislikes!: number;
}

export class ReviewsResponse {
	@ApiProperty({
		description: 'Estadísticas de calificaciones',
		type: ReviewRatingResponse,
	})
	rating!: ReviewRatingResponse;

	@ApiProperty({
		description: 'Lista de comentarios/reseñas',
		type: [ReviewCommentResponse],
	})
	comments!: ReviewCommentResponse[];
}

// ─── MoreExperiences ───────────────────────────────────────────────────────

export class MoreExperienceItemResponse {
	@ApiProperty({ description: 'ID de la experiencia', example: 'exp-uuid-002' })
	id!: string;

	@ApiProperty({
		description: 'Título de la experiencia',
		example: 'Kayak en el Lago Titicaca',
	})
	title!: string;

	@ApiProperty({
		description: 'Nombre del propietario',
		example: 'Comunidad Uros',
	})
	ownerName!: string;

	@ApiProperty({ description: 'Precio del grupo ADULTS', example: 85 })
	price!: number;

	@ApiProperty({
		description: 'Ubicación de la experiencia',
		example: 'Puno, Perú',
	})
	place!: string;

	@ApiProperty({ description: 'Duración en días', example: 2 })
	days!: number;

	@ApiProperty({
		description: 'Imagen principal de la experiencia',
		type: MediaItemFullDetail,
	})
	mainImage!: MediaItemFullDetail;
}

// ─── Main Response ─────────────────────────────────────────────────────────

export class ExperienceDetailResponse {
	@ApiProperty({
		description:
			'Sección hero con información principal de la experiencia, owner y media',
		type: HeroDetailResponse,
	})
	heroDetail!: HeroDetailResponse;

	@ApiProperty({
		description: 'Información general: edades, duración e idiomas',
		type: InformationResponse,
	})
	information!: InformationResponse;

	@ApiProperty({
		description: 'Disponibilidad de la experiencia',
		type: ExperienceAvailabilityResponse,
	})
	availability!: ExperienceAvailabilityResponse;

	@ApiProperty({
		description: 'Información de precios por edad',
		type: AgePricingInfoResponse,
	})
	agePricingInfo!: AgePricingInfoResponse;

	@ApiProperty({
		description:
			'Sección de preguntas frecuentes: qué incluye, qué llevar, políticas, etc.',
		type: QuestionSectionResponse,
	})
	questionSection!: QuestionSectionResponse;

	@ApiProperty({
		description: 'Itinerario completo de la experiencia por día',
		type: [ItineraryItemResponse],
	})
	itinerary!: ItineraryItemResponse[];

	@ApiProperty({
		description: '3 experiencias más recientes (excluyendo la actual)',
		type: [MoreExperienceItemResponse],
	})
	moreExperiences!: MoreExperienceItemResponse[];

	@ApiProperty({
		description: 'Reseñas de la experiencia con estadísticas y comentarios',
		type: ReviewsResponse,
	})
	review!: ReviewsResponse;
}
