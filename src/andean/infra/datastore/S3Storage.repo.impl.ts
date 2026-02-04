import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { StorageRepository } from '../../app/datastore/Storage.repo';

@Injectable()
export class S3StorageRepoImpl implements StorageRepository {
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

	private getPublicUrl(key: string): string {
		return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
	}

	private extractKeyFromUrl(url: string): string | null {
		try {
			const urlObj = new URL(url);
			return urlObj.pathname.substring(1);
		} catch {
			return null;
		}
	}

	private sanitizeFileName(fileName: string): string {
		return fileName
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9.-]/g, '');
	}
}
