import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
	SegmindRepository,
	SegmindTryOnResult,
} from '../../app/datastore/Segmind.repo';

const SEGMIND_VTON_URL = 'https://api.segmind.com/v1/segfit-v1.3';

@Injectable()
export class SegmindRepoImpl implements SegmindRepository {
	private readonly apiKey: string;

	constructor(private readonly configService: ConfigService) {
		this.apiKey = this.configService.get<string>('SEGMIND_API_KEY', '');
	}

	async tryOn(
		modelImageUrl: string,
		outfitImageUrl: string,
	): Promise<SegmindTryOnResult> {
		try {
			const response = await axios.post(
				SEGMIND_VTON_URL,
				{
					outfit_image: outfitImageUrl,
					model_image: modelImageUrl,
					model_type: 'Quality',
					cn_strength: 0.9,
					cn_end: 0.5,
					image_format: 'webp',
					image_quality: 90,
					seed: 42,
					base64: true,
				},
				{
					headers: {
						'x-api-key': this.apiKey,
						'Content-Type': 'application/json',
					},
					// Segmind puede tardar varios segundos procesando el modelo
					timeout: 120_000,
				},
			);

			const image: string = response.data?.image;

			if (!image) {
				throw new InternalServerErrorException(
					'Segmind did not return an image in the response',
				);
			}

			return { image, mimeType: 'image/webp' };
		} catch (error: any) {
			if (error instanceof InternalServerErrorException) throw error;

			const status = error?.response?.status;
			const message = error?.response?.data ?? error?.message;

			throw new InternalServerErrorException(
				`Segmind API error (${status ?? 'unknown'}): ${JSON.stringify(message)}`,
			);
		}
	}
}
