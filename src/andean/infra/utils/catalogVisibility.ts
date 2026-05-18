export function applyPublishedStatusFilter(
	query: Record<string, unknown>,
	includeAllStatuses: boolean | undefined,
	publishedStatus: string,
): void {
	if (!includeAllStatuses) {
		query.status = publishedStatus;
	}
}
