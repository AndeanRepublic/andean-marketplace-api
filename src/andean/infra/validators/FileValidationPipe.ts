import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FileValidationOptions {
	maxSizeMB?: number;
	allowedMimeTypes?: string[];
}

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Injectable()
export class FileValidationPipe implements PipeTransform {
	private readonly maxSizeBytes: number;
	private readonly allowedMimeTypes: string[];

	constructor(
		private readonly configService: ConfigService,
		options?: FileValidationOptions,
	) {
		const maxSizeMB =
			options?.maxSizeMB ??
			this.configService.get<number>('UPLOAD_MAX_SIZE_MB', DEFAULT_MAX_SIZE_MB);
		this.maxSizeBytes = maxSizeMB * 1024 * 1024;

		this.allowedMimeTypes =
			options?.allowedMimeTypes ?? DEFAULT_ALLOWED_MIME_TYPES;
	}

	transform(file: Express.Multer.File): Express.Multer.File {
		if (!file) {
			throw new BadRequestException('No file was provided');
		}

		// Validar tipo MIME
		if (!this.allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`File type not allowed. Accepted types: ${this.allowedMimeTypes.join(', ')}`,
			);
		}

		// Validar tamaño
		if (file.size > this.maxSizeBytes) {
			const maxSizeMB = this.maxSizeBytes / (1024 * 1024);
			throw new BadRequestException(
				`File exceeds the maximum allowed size of ${maxSizeMB}MB`,
			);
		}

		return file;
	}
}
