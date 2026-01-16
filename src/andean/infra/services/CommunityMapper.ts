import { CommunityDocument } from '../persistence/community.schema';
import { Community } from '../../domain/entities/community/Community';
import { CreateCommunityDto } from '../controllers/dto/community/CreateCommunityDto';
import * as crypto from 'crypto';
import { instanceToPlain, plainToInstance } from 'class-transformer';

export class CommunityMapper {
  static fromDocument(doc: CommunityDocument): Community {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;
    return plainToInstance(Community, rest);
  }

  static fromCreateDto(dto: CreateCommunityDto): Community {
    const { ...communityData } = dto;
    const plain = {
      id: crypto.randomUUID(),
      ...communityData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return plainToInstance(Community, plain);
  }

  static fromUpdateDto(id: string, dto: CreateCommunityDto): Community {
    const { ...communityData } = dto;
    const plain = {
      id: id,
      ...communityData,
      updatedAt: new Date(),
    };
    return plainToInstance(Community, plain);
  }

  static toPersistence(community: Community) {
    const plain = instanceToPlain(community);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
