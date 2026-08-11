import { BadRequestException } from '@nestjs/common';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { MediaItemRole } from 'src/andean/domain/enums/MediaItemRole';

export async function validateTextileProductBaseInfoMedia(
	mediaItemRepository: MediaItemRepository,
	mediaIds: string[] | undefined,
): Promise<void> {
	const ids = [
		...new Set(
			(mediaIds ?? []).filter((id) => typeof id === 'string' && id.trim()),
		),
	];
	if (ids.length < 2) {
		throw new BadRequestException(
			'baseInfo.mediaIds must include at least two distinct media items (gallery image and Try On image).',
		);
	}

	const items = await mediaItemRepository.getByIds(ids);
	if (items.length !== ids.length) {
		throw new BadRequestException(
			'One or more baseInfo.mediaIds refer to missing MediaItems.',
		);
	}

	const hasTryOn = items.some((m) => m.role === MediaItemRole.PRODUCT);
	const hasGallery = items.some(
		(m) =>
			m.role === MediaItemRole.PRINCIPAL ||
			m.role === MediaItemRole.SECUNDARY ||
			m.role === MediaItemRole.NONE,
	);
	if (!hasGallery) {
		throw new BadRequestException(
			'At least one gallery image (MediaItem with role PRINCIPAL, SECUNDARY or NONE) is required in baseInfo.mediaIds.',
		);
	}
	if (!hasTryOn) {
		throw new BadRequestException(
			'A Try On outfit image (MediaItem with role PRODUCT) is required in baseInfo.mediaIds.',
		);
	}
}
