import { MediaItemDocument } from '../persistence/mediaItem.schema';
import { MediaItem } from '../../domain/entities/MediaItem';
import { CreateMediaItemDto } from '../controllers/dto/media/CreateMediaItemDto';
import { UpdateMediaItemDto } from '../controllers/dto/media/UpdateMediaItemDto';
import { Types } from 'mongoose';

export class MediaItemMapper {
	static fromDocument(doc: MediaItemDocument): MediaItem {
		return new MediaItem(
			doc._id.toString(),
			doc.type,
			doc.name,
			doc.key,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateMediaItemDto): MediaItem {
		return new MediaItem(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.type,
			dto.name,
			dto.url, // Para compatibilidad con CreateMediaItemDto que tiene url
			new Date(),
			new Date(),
		);
	}

	static fromUploadData(type: string, name: string, key: string): MediaItem {
		return new MediaItem(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			type,
			name,
			key,
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
			existing.createdAt,
			new Date(),
		);
	}

	static toPersistence(entity: MediaItem): any {
		return {
			type: entity.type,
			name: entity.name,
			key: entity.key,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
