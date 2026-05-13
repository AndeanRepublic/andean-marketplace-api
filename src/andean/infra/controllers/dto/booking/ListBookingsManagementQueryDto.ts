import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../../../domain/enums/BookingStatus';

function toStatusArray(value: unknown): BookingStatus[] | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	const raw = Array.isArray(value) ? value : [value];
	const filtered = raw.filter(
		(v) => v !== undefined && v !== null && v !== '',
	) as string[];
	if (filtered.length === 0) {
		return undefined;
	}
	return filtered as BookingStatus[];
}

export class ListBookingsManagementQueryDto {
	@IsOptional()
	@Transform(({ value }) => toStatusArray(value))
	@IsArray()
	@IsEnum(BookingStatus, { each: true })
	status?: BookingStatus[];
}
