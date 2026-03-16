import { Types } from 'mongoose';
import { ProviderInfo } from '../../domain/entities/ProviderInfo';
import { ProviderInfoDocument } from '../persistence/providerInfo.schema';
import { CreateProviderInfoDto } from '../controllers/dto/providerInfo/CreateProviderInfoDto';
import { MongoIdUtils } from '../utils/MongoIdUtils';

export class ProviderInfoMapper {
	/**
	 * Generates a temporary ObjectId string as id — it will be replaced by
	 * the real MongoDB _id once the document is saved and fromDocument is called.
	 */
	static fromCreateDto(dto: CreateProviderInfoDto): ProviderInfo {
		const id = new Types.ObjectId().toString();
		return new ProviderInfo(
			id,
			dto.craftType,
			dto.tagline,
			dto.shortBio,
			dto.originPlace,
			dto.testimonialsOrAwards,
			dto.workplacePhotoMediaId,
			dto.presentationVideoMediaId,
			dto.isPartOfOrganization ?? false,
			dto.organizationName,
			dto.memberCount,
			dto.exactLocation,
			dto.contactAddress,
			dto.contactPhone,
			dto.contactEmail,
			dto.spokenLanguages,
			dto.hasInternetAccess,
			dto.connectionTypes,
			dto.extendedStory,
			dto.foundingYear,
			dto.projectTimeline,
			dto.womenArtisanPercentage,
			dto.includesPeopleWithDisabilities,
			dto.hasYouthInvolvement,
			dto.indirectBeneficiaryChildren,
			dto.averageArtisanAge,
			dto.parallelActivities,
			dto.programParticipation,
			dto.trainingReceived,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateProviderInfoDto,
	): Partial<ProviderInfo> {
		const { ...rest } = dto;
		return { ...rest };
	}

	static fromDocument(doc: ProviderInfoDocument): ProviderInfo {
		return new ProviderInfo(
			MongoIdUtils.objectIdToString((doc as any)._id),
			doc.craftType,
			doc.tagline,
			doc.shortBio,
			doc.originPlace,
			doc.testimonialsOrAwards,
			doc.workplacePhotoMediaId,
			doc.presentationVideoMediaId,
			doc.isPartOfOrganization ?? false,
			doc.organizationName,
			doc.memberCount,
			doc.exactLocation,
			doc.contactAddress,
			doc.contactPhone,
			doc.contactEmail,
			doc.spokenLanguages,
			doc.hasInternetAccess,
			doc.connectionTypes,
			doc.extendedStory,
			doc.foundingYear,
			doc.projectTimeline,
			doc.womenArtisanPercentage,
			doc.includesPeopleWithDisabilities,
			doc.hasYouthInvolvement,
			doc.indirectBeneficiaryChildren,
			doc.averageArtisanAge,
			doc.parallelActivities,
			doc.programParticipation,
			doc.trainingReceived,
		);
	}
}
