import {
	Inject,
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { Box } from '../../../domain/entities/box/Box';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { BOX_LINE_TO_PRODUCT_TYPE } from '../box/boxLineProductTypeMap';

export type SellableBoxResolution = {
	box: Box;
	maxSellableBoxes: number;
};

@Injectable()
export class BoxCartAvailabilityService {
	constructor(
		@Inject(BoxRepository)
		private readonly boxRepository: BoxRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) {}

	async requireSellableBox(boxId: string): Promise<SellableBoxResolution> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) {
			throw new NotFoundException('Box not found');
		}
		if (box.status !== AdminEntityStatus.PUBLISHED) {
			throw new BadRequestException(
				'Esta caja no está disponible para la venta',
			);
		}
		const maxSellableBoxes = await this.computeMaxSellableBoxes(box);
		if (maxSellableBoxes <= 0) {
			throw new BadRequestException(
				'La caja no tiene stock disponible (variantes internas sin inventario)',
			);
		}
		return { box, maxSellableBoxes };
	}

	/**
	 * Stock máximo de cajas según variantes internas, sin exigir PUBLISHED.
	 * Para líneas ya en carrito o respuesta GET carrito.
	 */
	async maxSellableForBoxId(boxId: string): Promise<number> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) {
			throw new NotFoundException('Box not found');
		}
		return this.computeMaxSellableBoxes(box);
	}

	private async computeMaxSellableBoxes(box: Box): Promise<number> {
		const stocks: number[] = [];

		for (const line of box.products) {
			if (!line.variantId?.trim() || !line.productType) {
				continue;
			}
			const mapped =
				BOX_LINE_TO_PRODUCT_TYPE[line.productType as BoxProductType];
			if (!mapped) {
				continue;
			}

			const variant = await this.variantRepository.getById(line.variantId);
			if (!variant || variant.productType !== mapped) {
				continue;
			}
			stocks.push(variant.stock);
		}

		if (stocks.length === 0) {
			return 0;
		}

		return Math.min(...stocks);
	}
}
