import { ApiProperty } from '@nestjs/swagger';

export class VoteResult {
	@ApiProperty({
		description: 'Total number of likes on the review',
		example: 5,
	})
	numberLikes: number;

	@ApiProperty({
		description: 'Total number of dislikes on the review',
		example: 2,
	})
	numberDislikes: number;

	@ApiProperty({
		description: 'Current user vote status',
		example: 'like',
		enum: ['like', 'dislike', null],
		nullable: true,
	})
	userVote: 'like' | 'dislike' | null;
}
