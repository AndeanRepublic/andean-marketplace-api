import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { StockReducerStrategy } from './StockReducerStrategy';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { StockReductionItem } from '../../../domain/interfaces/StockReductionItem';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { IStockReducerRegistry } from './IStockReducerRegistry';

const BOX_PRODUCT_TYPE_MAP: Record<BoxProductType, ProductType> = {
	[BoxProductType.TEXTILE]: ProductType.TEXTILE,
	[BoxProductType.SUPERFOOD]: ProductType.SUPERFOOD,
};

@Injectable()
export class BoxStockReducer extends StockReducerStrategy {
	readonly productType = ProductType.BOX;

	constructor(
		@Inject(BoxRepository)
		private readonly boxRepository: BoxRepository,
		private readonly moduleRef: ModuleRef,
	) {
		super();
	}

	async reduceStock(item: StockReductionItem): Promise<void> {
		const box = await this.boxRepository.getById(item.productId);
		if (!box) {
			throw new NotFoundException(`Box not found: ${item.productId}`);
		}

		// Lazy resolution rompe el ciclo circular con StockReducerRegistry
		const registry = this.moduleRef.get<IStockReducerRegistry>(
			IStockReducerRegistry,
			{ strict: false },
		);

		// Cada producto dentro del box tiene cantidad 1
		for (const boxProduct of box.products) {
			if (!boxProduct.productType || !boxProduct.productId) continue;

			const mappedType = BOX_PRODUCT_TYPE_MAP[boxProduct.productType];

			await registry.reduceStock({
				productType: mappedType,
				productId: boxProduct.productId,
				quantity: 1,
				variantId: boxProduct.variantId,
			});
		}
	}
}
