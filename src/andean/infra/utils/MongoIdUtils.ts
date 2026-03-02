import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

/**
 * Utilidades para conversión de IDs de MongoDB
 */
export class MongoIdUtils {
	/**
	 * Convierte un string ID a ObjectId de MongoDB
	 * @param id - ID en formato string (ObjectId o UUID)
	 * @returns ObjectId de MongoDB
	 */
	static stringToObjectId(id: string): Types.ObjectId {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException(
				`Invalid ID format: "${id}". ID must be a valid MongoDB ObjectId (24 character hex string).`,
			);
		}
		return new Types.ObjectId(id);
	}

	/**
	 * Convierte un ObjectId a string
	 * @param objectId - ObjectId de MongoDB
	 * @returns ID en formato string
	 */
	static objectIdToString(objectId: Types.ObjectId): string {
		return objectId.toString();
	}
}
