import { MediaItemDocument } from '../persistence/mediaItem.schema';
import { MediaItem } from '../../domain/entities/MediaItem';
import { CreateMediaItemDto } from '../controllers/dto/media/CreateMediaItemDto';
import { UpdateMediaItemDto } from '../controllers/dto/media/UpdateMediaItemDto';
import { Types } from 'mongoose';
import { MediaItemType } from '../../domain/enums/MediaItemType';
import { MediaItemRole } from '../../domain/enums/MediaItemRole';

export class MediaItemMapper {
	static fromDocument(doc: MediaItemDocument): MediaItem {
		const plain = doc.toObject();
		return new MediaItem(
			plain._id.toString(),
			plain.type,
			plain.name,
			plain.key,
			plain.role,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateMediaItemDto): MediaItem {
		return new MediaItem(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.type,
			dto.name,
			dto.url, // Para compatibilidad con CreateMediaItemDto que tiene url
			dto.role ?? MediaItemRole.NONE,
			new Date(),
			new Date(),
		);
	}

	static fromUploadData(
		type: MediaItemType,
		name: string,
		key: string,
		role: MediaItemRole = MediaItemRole.NONE,
	): MediaItem {
		return new MediaItem(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			type,
			name,
			key,
			role,
			new Date(),
			new Date(),
		);
	}

	static fromUpdateDto(
		dto: UpdateMediaItemDto,
		existing: MediaItem,
	): MediaItem {
		return new MediaItem(
			existing.id,
			dto.type ?? existing.type,
			dto.name ?? existing.name,
			dto.url ?? existing.key, // Mapear url del DTO al key de la entidad
			dto.role ?? existing.role,
			existing.createdAt,
			new Date(),
		);
	}

	static toPersistence(entity: MediaItem): any {
		return {
			type: entity.type,
			name: entity.name,
			key: entity.key,
			role: entity.role,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
