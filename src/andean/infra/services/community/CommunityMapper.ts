import { CommunityDocument } from '../../persistence/community/community.schema';
import { Community } from '../../../domain/entities/community/Community';
import { CreateCommunityDto } from '../../controllers/dto/community/CreateCommunityDto';
import { UpdateCommunityDto } from '../../controllers/dto/community/UpdateCommunityDto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

export class CommunityMapper {
	/**
	 * Convierte un documento de MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(doc: CommunityDocument): Community {
		const plain = doc.toObject();
		return plainToInstance(Community, {
			id: MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			status:
				plain.status === AdminEntityStatus.PUBLISHED
					? AdminEntityStatus.PUBLISHED
					: AdminEntityStatus.HIDDEN,
			...plain,
		});
	}

	static fromCreateDto(dto: CreateCommunityDto): Community {
		const plain = {
			id: new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			...dto,
			status: AdminEntityStatus.HIDDEN,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return plainToInstance(Community, plain);
	}

	static fromUpdateDto(id: string, dto: UpdateCommunityDto): Community {
		const plain = {
			id: id,
			...dto,
			updatedAt: new Date(),
		};
		return plainToInstance(Community, plain);
	}

	/**
	 * Convierte entidad de dominio a formato de persistencia
	 * Excluye el 'id' ya que MongoDB usará _id automáticamente
	 */
	static toPersistence(community: Community) {
		const plain = instanceToPlain(community);
		const { id, ...dataForDB } = plain;
		return dataForDB;
	}
}
