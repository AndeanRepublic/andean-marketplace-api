import { CreateReviewDto } from './CreateReviewDto';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) { }
