import {
	IsString,
	IsNotEmpty,
	IsEnum,
	IsArray,
	IsNumber,
	IsOptional,
	ValidateNested,
	IsInt,
	Min,
	IsBoolean,
	IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { Gender } from 'src/andean/domain/enums/Gender';
import { Season } from 'src/andean/domain/enums/Season';
import { ToolUsed } from 'src/andean/domain/enums/ToolUsed';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';
import { CreateProductTraceabilityDto } from '../traceability/CreateProductTraceabilityDto';

export class PreparationTimeDto {
	@ApiProperty({
		description: 'Número de días requeridos para la preparación',
		example: 5,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsNotEmpty()
	days: number;

	@ApiProperty({
		description: 'Número de horas adicionales requeridas para la preparación',
		example: 4,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsNotEmpty()
	hours: number;
}

export class BaseInfoDto {
	@ApiProperty({
		description: 'Título del producto textil',
		example: 'Poncho Tradicional Andino',
		minLength: 2,
		maxLength: 200,
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'Lista de IDs de archivos multimedia asociados al producto',
		type: [String],
		example: ['media-001', 'media-002', 'media-003'],
	})
	@IsArray()
	@IsString({ each: true })
	media: string[];

	@ApiProperty({
		description: 'Descripción detallada del producto',
		example: 'Poncho tejido a mano con lana de alpaca, diseño tradicional de la región de Cusco',
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({
		description: 'Tipo de propietario del producto',
		enum: OwnerType,
		example: OwnerType.SHOP,
	})
	@IsEnum(OwnerType)
	@IsNotEmpty()
	ownerType: OwnerType;

	@ApiProperty({
		description: 'ID del propietario (tienda o comunidad)',
		example: 'shop-uuid-1234',
	})
	@IsString()
	@IsNotEmpty()
	ownerId: string;

	@ApiPropertyOptional({
		description: 'Información adicional del producto',
		example: 'Cuidados especiales: lavar a mano con agua fría',
	})
	@IsString()
	@IsOptional()
	information?: string;
}

export class PriceInventaryDto {
	@ApiProperty({
		description: 'Precio base del producto en la moneda configurada',
		example: 150.00,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	basePrice: number;

	@ApiProperty({
		description: 'Stock total disponible del producto',
		example: 25,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsNotEmpty()
	totalStock: number;

	@ApiPropertyOptional({
		description: 'Código SKU único del producto',
		example: 'TEX-PON-001',
	})
	@IsString()
	@IsOptional()
	SKU?: string;
}

export class AtributeDto {
	@ApiPropertyOptional({
		description: 'ID del tipo de textil',
		example: 'textile-type-001',
	})
	@IsString()
	@IsOptional()
	textileTypeId?: string;

	@ApiPropertyOptional({
		description: 'ID de la subcategoría del producto',
		example: 'subcategory-001',
	})
	@IsString()
	@IsOptional()
	subcategoryId?: string;

	@ApiPropertyOptional({
		description: 'Género objetivo del producto',
		enum: Gender,
		example: Gender.UNISEX,
	})
	@IsEnum(Gender)
	@IsOptional()
	gender?: Gender;

	@ApiPropertyOptional({
		description: 'ID del estilo textil',
		example: 'style-traditional-001',
	})
	@IsString()
	@IsOptional()
	textileStyleId?: string;

	@ApiPropertyOptional({
		description: 'Temporada recomendada para el producto',
		enum: Season,
		example: Season.WINTER,
	})
	@IsEnum(Season)
	@IsOptional()
	season?: Season;

	@ApiPropertyOptional({
		description: 'Usos principales del producto',
		type: [String],
		example: ['casual', 'ceremonial', 'decorativo'],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	principalUse?: string[];

	@ApiPropertyOptional({
		description: 'Tiempo de preparación del producto',
		type: PreparationTimeDto,
	})
	@ValidateNested()
	@Type(() => PreparationTimeDto)
	@IsOptional()
	preparationTime?: PreparationTimeDto;
}

export class TextileOptionsItemDto {
	@ApiProperty({
		description: 'Etiqueta visible del valor de la opción',
		example: 'Rojo Carmesí',
	})
	@IsString()
	@IsNotEmpty()
	label: string;

	@ApiPropertyOptional({
		description: 'IDs de archivos multimedia asociados a este valor',
		type: [String],
		example: ['media-color-rojo-001'],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	mediaIds?: string[];

	@ApiPropertyOptional({
		description: 'ID de la opción alternativa relacionada (color o talla alternativa)',
		example: 'alt-color-001',
	})
	@IsString()
	@IsOptional()
	idOpcionAlternative?: string;
}

export class TextileOptionsDto {
	@ApiProperty({ enum: TextileOptionName, description: 'Nombre de la opción' })
	@IsEnum(TextileOptionName)
	@IsNotEmpty()
	name: TextileOptionName;

	@ApiProperty({
		description: 'Valores disponibles para esta opción',
		type: [TextileOptionsItemDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TextileOptionsItemDto)
	@IsNotEmpty()
	values: TextileOptionsItemDto[];
}

export class TextileVariantDto {
	@ApiProperty({
		description: 'Combinación de opciones que define esta variante',
		example: { color: 'rojo', size: 'M' },
	})
	@IsObject()
	@IsNotEmpty()
	combination: Record<string, string>;

	@ApiProperty({
		description: 'Precio específico de esta variante',
		example: 165.00,
		minimum: 0,
	})
	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	price: number;

	@ApiProperty({
		description: 'Stock disponible de esta variante',
		example: 10,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsNotEmpty()
	stock: number;
}

export class DetailTraceabilityDto {
	@ApiPropertyOptional({
		description: 'Indica si el producto es hecho a mano',
		example: true,
	})
	@IsBoolean()
	@IsOptional()
	isHandmade?: boolean;

	@ApiPropertyOptional({
		description: 'Materiales secundarios utilizados en el producto',
		type: [String],
		example: ['algodón', 'seda'],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	secondaryMaterial?: string[];

	@ApiPropertyOptional({
		description: 'ID de la comunidad de origen del producto',
		example: 'community-cusco-001',
	})
	@IsString()
	@IsOptional()
	originProductCommunityId?: string;

	@ApiPropertyOptional({
		description: 'ID de la técnica artesanal utilizada',
		example: 'technique-telar-001',
	})
	@IsString()
	@IsOptional()
	craftTechniqueId?: string;

	@ApiPropertyOptional({
		description: 'Tipo de herramientas utilizadas en la elaboración',
		enum: ToolUsed,
		example: ToolUsed.MANUAL,
	})
	@IsEnum(ToolUsed)
	@IsOptional()
	toolUsed?: ToolUsed;

	@ApiPropertyOptional({
		description: 'Indica si el producto es exclusivo del artesano',
		example: true,
	})
	@IsBoolean()
	@IsOptional()
	isArtisanExclusive?: boolean;

	@ApiPropertyOptional({
		description: 'Indica si es una creación original',
		example: true,
	})
	@IsBoolean()
	@IsOptional()
	isOriginalCreation?: boolean;

	@ApiPropertyOptional({
		description: 'Indica si el diseño está registrado',
		example: false,
	})
	@IsBoolean()
	@IsOptional()
	isRegisteredDesign?: boolean;

	@ApiPropertyOptional({
		description: 'Indica si se acepta pedido anticipado',
		example: true,
	})
	@IsBoolean()
	@IsOptional()
	isBackorderAvailable?: boolean;

	@ApiPropertyOptional({
		description: 'Tiempo de entrega en días para pedidos anticipados',
		example: 15,
		minimum: 0,
	})
	@IsInt()
	@Min(0)
	@IsOptional()
	leadTime?: number;

	@ApiPropertyOptional({
		description: 'ID de la certificación del producto',
		example: 'certification-fair-trade-001',
	})
	@IsString()
	@IsOptional()
	certificationId?: string;
}

export class CreateTextileProductDto {
	@ApiProperty({
		description: 'Estado del producto textil',
		enum: TextileProductStatus,
		example: TextileProductStatus.PUBLISHED,
	})
	@IsEnum(TextileProductStatus)
	@IsNotEmpty()
	status: TextileProductStatus;

	@ApiProperty({
		description: 'Información básica del producto (título, descripción, media, propietario)',
		type: BaseInfoDto,
	})
	@ValidateNested()
	@Type(() => BaseInfoDto)
	@IsNotEmpty()
	baseInfo: BaseInfoDto;

	@ApiProperty({
		description: 'Información de precio e inventario',
		type: PriceInventaryDto,
	})
	@ValidateNested()
	@Type(() => PriceInventaryDto)
	@IsNotEmpty()
	priceInventary: PriceInventaryDto;

	@ApiPropertyOptional({
		description: 'ID de la categoría del producto textil',
		example: 'category-ponchos-001',
	})
	@IsString()
	@IsOptional()
	categoryId?: string;

	@ApiPropertyOptional({
		description: 'Atributos adicionales del producto (tipo, género, estilo, temporada)',
		type: AtributeDto,
	})
	@ValidateNested()
	@Type(() => AtributeDto)
	@IsOptional()
	atribute?: AtributeDto;

	@ApiPropertyOptional({
		description: 'Detalles de trazabilidad del producto (artesanal, materiales, técnicas)',
		type: DetailTraceabilityDto,
	})
	@ValidateNested()
	@Type(() => DetailTraceabilityDto)
	@IsOptional()
	detailTraceability?: DetailTraceabilityDto;

	@ApiPropertyOptional({
		description: 'Información de trazabilidad del producto',
		type: CreateProductTraceabilityDto,
	})
	@IsOptional()
	productTraceability?: CreateProductTraceabilityDto;

	@ApiPropertyOptional({
		description: 'Opciones disponibles del producto (colores, tallas)',
		type: [TextileOptionsDto],
	})
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TextileOptionsDto)
	options?: TextileOptionsDto[];

	@ApiPropertyOptional({
		description: 'Variantes del producto con combinaciones específicas de opciones',
		type: [TextileVariantDto],
	})
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TextileVariantDto)
	variants?: TextileVariantDto[];
}
