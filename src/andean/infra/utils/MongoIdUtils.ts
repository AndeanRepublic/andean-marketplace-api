import { Types } from 'mongoose';

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
