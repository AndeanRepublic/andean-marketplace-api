import { Inject, Injectable } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../app/datastore/superfoods/SuperfoodColor.repo';
import {
	SuperfoodProductListColor,
	SuperfoodProductListItem,
} from '../../../app/models/superfoods/SuperfoodProductListItem';

@Injectable()
export class SuperfoodProductListColorResolver {
	constructor(
		@Inject(SuperfoodColorRepository)
		private readonly superfoodColorRepository: SuperfoodColorRepository,
	) {}

	async resolveById(
		id: string | null | undefined,
	): Promise<SuperfoodProductListColor | undefined> {
		if (typeof id !== 'string' || id.trim().length === 0) {
			return undefined;
		}
		const color = await this.superfoodColorRepository.getById(id.trim());
		return color ? this.toListColor(color) : undefined;
	}

	async resolveByIds(
		ids: string[],
	): Promise<Map<string, SuperfoodProductListColor>> {
		const unique = [
			...new Set(
				ids
					.filter(
						(id): id is string =>
							typeof id === 'string' && id.trim().length > 0,
					)
					.map((id) => id.trim()),
			),
		];
		if (unique.length === 0) {
			return new Map();
		}
		const colors = await this.superfoodColorRepository.getByIds(unique);
		return new Map(colors.map((c) => [c.id, this.toListColor(c)]));
	}

	async attachCatalogColorFromAggregate(
		rows: Array<SuperfoodProductListItem & { colorId?: string | null }>,
	): Promise<SuperfoodProductListItem[]> {
		const catalogIds = [
			...new Set(
				rows
					.map((r) => r.colorId)
					.filter(
						(id): id is string =>
							typeof id === 'string' && id.trim().length > 0,
					),
			),
		];
		const colorById = await this.resolveByIds(catalogIds);
		return rows.map(({ colorId, ...rest }) => {
			const resolved: SuperfoodProductListItem['color'] = colorId
				? colorById.get(colorId)
				: undefined;
			return { ...rest, color: resolved };
		});
	}

	private toListColor(c: {
		name: string;
		hexCodeColor: string;
	}): SuperfoodProductListColor {
		return { name: c.name, hexCodeColor: c.hexCodeColor };
	}
}
