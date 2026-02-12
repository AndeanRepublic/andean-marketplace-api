export abstract class StorageRepository {
	/**
	 * Upload a file to storage
	 * @param file - File buffer
	 * @param type - Type/folder (e.g., 'products', 'avatars', 'banners')
	 * @param fileName - Original file name
	 * @param mimeType - File MIME type
	 * @returns Key (path) of the uploaded file
	 */
	abstract uploadFile(
		file: Buffer,
		type: string,
		fileName: string,
		mimeType: string,
	): Promise<string>;

	/**
	 * Delete a file from storage
	 * @param key - Key (path) of the file to delete
	 */
	abstract deleteFile(key: string): Promise<void>;
}
