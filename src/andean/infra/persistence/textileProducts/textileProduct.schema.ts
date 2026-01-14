import { Document, Schema } from 'mongoose';
import { TextileProductStatus } from 'src/andean/domain/enums/TextileProductStatus';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { Gender } from 'src/andean/domain/enums/Gender';
import { Season } from 'src/andean/domain/enums/Season';

export const TextileProductSchema = new Schema({
  _id: String,
  id: String,
  categoryId: String,
  status: {
    type: String,
    enum: Object.values(TextileProductStatus),
    required: true,
  },
  baseInfo: {
    title: String,
    media: [String],
    description: String,
    ownerType: {
      type: String,
      enum: Object.values(OwnerType),
      required: true,
    },
    ownerId: String,
  },
  priceInventary: {
    basePrice: Number,
    totalStock: Number,
    SKU: String,
  },
  atribute: {
    textileTypeId: String,
    subcategoryId: String,
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    textileStyleId: String,
    season: {
      type: String,
      enum: Object.values(Season),
    },
    principalUse: [String],
    preparationTime: {
      days: Number,
      hours: Number,
    },
  },
});

export interface TextileProductDocument extends Document<string> {
  _id: string;
  id: string;
  categoryId: string;
  status: TextileProductStatus;
  baseInfo: {
    title: string;
    media: string[];
    description: string;
    ownerType: OwnerType;
    ownerId: string;
  };
  priceInventary: {
    basePrice: number;
    totalStock: number;
    SKU: string;
  };
  atribute?: {
    textileTypeId: string;
    subcategoryId: string;
    gender: Gender;
    textileStyleId: string;
    season: Season;
    principalUse: string[];
    preparationTime: {
      days: number;
      hours: number;
    };
  };
}
