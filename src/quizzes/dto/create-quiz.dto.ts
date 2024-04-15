import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { QuestionCategory } from '../../question-categories/domain/question-category';
import { QuizTypeEnum } from '../domain/quiz';

export class CreateQuizDto {
  @ApiProperty({ type: [QuestionCategory], example: [{ id: '1' }] })
  @IsOptional()
  @Type(() => QuestionCategory)
  categories: QuestionCategory[];

  @ApiProperty({ example: QuizTypeEnum.EXAM })
  @IsEnum(QuizTypeEnum)
  type: QuizTypeEnum;

  @ApiProperty({ example: 0 })
  @IsInt()
  totalQuestions: number;
}
