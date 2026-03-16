import {
	IsOptional,
	IsString,
	IsBoolean,
	IsNumber,
	IsArray,
	IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from '../../../../domain/enums/Language';
import { ConnectionType } from '../../../../domain/enums/ConnectionType';

export class CreateProviderInfoDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	craftType?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	tagline?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	shortBio?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	originPlace?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	testimonialsOrAwards?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	workplacePhotoMediaId?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	presentationVideoMediaId?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	isPartOfOrganization?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	organizationName?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	memberCount?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	exactLocation?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	contactAddress?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	contactPhone?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	contactEmail?: string;

	@ApiPropertyOptional({ enum: Language, isArray: true })
	@IsOptional()
	@IsArray()
	@IsEnum(Language, { each: true })
	spokenLanguages?: Language[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	hasInternetAccess?: boolean;

	@ApiPropertyOptional({ enum: ConnectionType, isArray: true })
	@IsOptional()
	@IsArray()
	@IsEnum(ConnectionType, { each: true })
	connectionTypes?: ConnectionType[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	extendedStory?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	foundingYear?: number;

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	projectTimeline?: string[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	womenArtisanPercentage?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	includesPeopleWithDisabilities?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	hasYouthInvolvement?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	indirectBeneficiaryChildren?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	averageArtisanAge?: number;

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	parallelActivities?: string[];

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	programParticipation?: string[];

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	trainingReceived?: string;
}
