import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class S3StorageService {
	private readonly s3Client: S3Client;
	private readonly bucket: string;
	private readonly region: string;

	constructor(private readonly configService: ConfigService) {
		this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
		this.bucket = this.configService.get<string>('AWS_S3_BUCKET', '');

		this.s3Client = new S3Client({
			region: this.region,
			credentials: {
				accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
				secretAccessKey: this.configService.get<string>(
					'AWS_SECRET_ACCESS_KEY',
					'',
				),
			},
		});
	}

	/**
	 * Sube un archivo a S3 organizado por tipo
	 * @param file - Buffer del archivo
	 * @param type - Tipo/carpeta (ej: 'products', 'avatars', 'banners')
	 * @param fileName - Nombre original del archivo
	 * @param mimeType - Tipo MIME del archivo
	 * @returns URL pública del archivo subido
	 */
	async uploadFile(
		file: Buffer,
		type: string,
		fileName: string,
		mimeType: string,
	): Promise<string> {
		const uuid = crypto.randomUUID();
		const sanitizedFileName = this.sanitizeFileName(fileName);
		const key = `${type}/${uuid}-${sanitizedFileName}`;

		try {
			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: file,
				ContentType: mimeType,
			});

			await this.s3Client.send(command);

			return this.getPublicUrl(key);
		} catch (error) {
			throw new InternalServerErrorException(
				`Error uploading file to S3: ${error.message}`,
			);
		}
	}

	/**
	 * Elimina un archivo de S3
	 * @param url - URL completa del archivo a eliminar
	 */
	async deleteFile(url: string): Promise<void> {
		const key = this.extractKeyFromUrl(url);

		if (!key) {
			return;
		}

		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key,
			});

			await this.s3Client.send(command);
		} catch (error) {
			throw new InternalServerErrorException(
				`Error deleting file from S3: ${error.message}`,
			);
		}
	}

	/**
	 * Genera la URL pública del archivo
	 */
	private getPublicUrl(key: string): string {
		return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
	}

	/**
	 * Extrae la key de S3 desde una URL completa
	 */
	private extractKeyFromUrl(url: string): string | null {
		try {
			const urlObj = new URL(url);
			// Quita el / inicial del pathname
			return urlObj.pathname.substring(1);
		} catch {
			return null;
		}
	}

	/**
	 * Sanitiza el nombre del archivo para evitar caracteres problemáticos
	 */
	private sanitizeFileName(fileName: string): string {
		return fileName
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9.-]/g, '');
	}
}
