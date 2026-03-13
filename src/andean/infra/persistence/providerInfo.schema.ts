import { Document, Schema } from 'mongoose';
import { Language } from '../../domain/enums/Language';
import { ConnectionType } from '../../domain/enums/ConnectionType';

export const ProviderInfoSchema = new Schema({
	craftType: { type: String, required: false },
	tagline: { type: String, required: false },
	shortBio: { type: String, required: false },
	originPlace: { type: String, required: false },
	testimonialsOrAwards: { type: String, required: false },

	artisanPhotoMediaId: { type: String, required: false },
	workplacePhotoMediaId: { type: String, required: false },
	presentationVideoMediaId: { type: String, required: false },

	isPartOfOrganization: { type: Boolean, required: true, default: false },
	organizationName: { type: String, required: false },
	memberCount: { type: Number, required: false },

	exactLocation: { type: String, required: false },

	contactAddress: { type: String, required: false },
	contactPhone: { type: String, required: false },
	contactEmail: { type: String, required: false },

	spokenLanguages: {
		type: [String],
		enum: Object.values(Language),
		default: [],
		required: false,
	},

	hasInternetAccess: { type: Boolean, required: false },
	connectionTypes: {
		type: [String],
		enum: Object.values(ConnectionType),
		default: [],
		required: false,
	},

	extendedStory: { type: String, required: false },
	foundingYear: { type: Number, required: false },
	projectTimeline: { type: [String], default: [], required: false },

	womenArtisanPercentage: { type: Number, required: false },

	includesPeopleWithDisabilities: { type: Boolean, required: false },
	hasYouthInvolvement: { type: Boolean, required: false },
	indirectBeneficiaryChildren: { type: String, required: false },

	averageArtisanAge: { type: Number, required: false },

	parallelActivities: { type: [String], default: [], required: false },
	programParticipation: { type: [String], default: [], required: false },

	trainingReceived: { type: String, required: false },
});

export interface ProviderInfoDocument extends Document {
	craftType?: string;
	tagline?: string;
	shortBio?: string;
	originPlace?: string;
	testimonialsOrAwards?: string;

	artisanPhotoMediaId?: string;
	workplacePhotoMediaId?: string;
	presentationVideoMediaId?: string;

	isPartOfOrganization: boolean;
	organizationName?: string;
	memberCount?: number;

	exactLocation?: string;

	contactAddress?: string;
	contactPhone?: string;
	contactEmail?: string;

	spokenLanguages?: Language[];

	hasInternetAccess?: boolean;
	connectionTypes?: ConnectionType[];

	extendedStory?: string;
	foundingYear?: number;
	projectTimeline?: string[];

	womenArtisanPercentage?: number;

	includesPeopleWithDisabilities?: boolean;
	hasYouthInvolvement?: boolean;
	indirectBeneficiaryChildren?: string;

	averageArtisanAge?: number;

	parallelActivities?: string[];
	programParticipation?: string[];

	trainingReceived?: string;
}
