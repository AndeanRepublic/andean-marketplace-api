import { SuperfoodProductMedia } from '../entities/superfoods/SuperfoodProductMedia';

/** Lista única de IDs de media referenciados en `productMedia` (para batch fetch). */
export function collectSuperfoodProductMediaIds(
	pm: SuperfoodProductMedia | undefined | null,
): string[] {
	if (!pm) return [];
	const out: string[] = [];
	const push = (id: string | undefined) => {
		const t = id?.trim();
		if (t) out.push(t);
	};
	push(pm.mainImgId);
	push(pm.plateImgId);
	push(pm.sourceProductImgId);
	push(pm.closestSourceProductImgId);
	for (const id of pm.otherImagesId ?? []) push(id);
	return [...new Set(out)];
}
