import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuizAnswer } from '../domain/quiz-answer';

export class FilterQuizAnswerDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isCorrect?: boolean | null;
}

export class SortQuizAnswerDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof QuizAnswer;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryQuizAnswerDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterQuizAnswerDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterQuizAnswerDto)
  filters?: FilterQuizAnswerDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortQuizAnswerDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortQuizAnswerDto)
  sort?: SortQuizAnswerDto[] | null;
}
