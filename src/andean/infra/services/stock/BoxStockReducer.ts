import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { StockReducerStrategy } from './StockReducerStrategy';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { StockReductionItem } from '../../../app/models/shop/StockReductionItem';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { IStockReducerRegistry } from './IStockReducerRegistry';
import { BOX_LINE_TO_PRODUCT_TYPE } from '../box/boxLineProductTypeMap';

@Injectable()
export class BoxStockReducer extends StockReducerStrategy {
	readonly productType = ProductType.BOX;

	constructor(
		@Inject(BoxRepository)
		private readonly boxRepository: BoxRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		private readonly moduleRef: ModuleRef,
	) {
		super();
	}

	async reduceStock(item: StockReductionItem): Promise<void> {
		const box = await this.boxRepository.getById(item.productId);
		if (!box) {
			throw new NotFoundException(`Box not found: ${item.productId}`);
		}

		const registry = this.moduleRef.get<IStockReducerRegistry>(
			IStockReducerRegistry,
			{ strict: false },
		);

		for (const boxProduct of box.products) {
			if (!boxProduct.productType || !boxProduct.variantId) continue;

			const variant = await this.variantRepository.getById(
				boxProduct.variantId,
			);
			if (!variant) continue;

			const mappedType =
				BOX_LINE_TO_PRODUCT_TYPE[boxProduct.productType as BoxProductType];
			if (!mappedType || variant.productType !== mappedType) continue;

			await registry.reduceStock({
				productType: mappedType,
				productId: variant.productId,
				quantity: item.quantity,
				variantId: boxProduct.variantId,
			});
		}
	}
}
