import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SegmindRepository } from '../../app/datastore/Segmind.repo';

const SEGMIND_VTON_URL = 'https://api.segmind.com/v1/idm-vton';

@Injectable()
export class SegmindRepoImpl implements SegmindRepository {
	private readonly apiKey: string;

	constructor(private readonly configService: ConfigService) {
		this.apiKey = this.configService.get<string>('SEGMIND_API_KEY', '');
	}

	async tryOn(
		humanImageBase64: string,
		garmentImageUrl: string,
		garmentDescription?: string,
	): Promise<string> {
		try {
			const response = await axios.post(
				SEGMIND_VTON_URL,
				{
					crop: false,
					seed: 42,
					steps: 30,
					category: 'upper_body',
					force_dc: false,
					human_img: humanImageBase64,
					garm_img: garmentImageUrl,
					mask_only: false,
					garment_des: garmentDescription ?? '',
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

			const imageBase64: string = response.data?.image;

			if (!imageBase64) {
				throw new InternalServerErrorException(
					'Segmind did not return an image in the response',
				);
			}

			return imageBase64;
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
