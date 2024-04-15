import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { QuestionCategory } from '../../question-categories/domain/question-category';
import { QuestionAnswerEnum } from '../domain/question';
import { QuestionsLanguageEnum } from '../infrastructure/persistence/document/entities/question.schema';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Quelle est le bon QNH ... ?' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Le QNH est ... car ...' })
  @IsOptional()
  explanation?: string;

  @ApiPropertyOptional({ example: 'https://annex.com/exemple' })
  @IsOptional()
  annex?: string;

  @ApiProperty({ example: '1021' })
  @IsNotEmpty()
  answer_1: string;

  @ApiProperty({ example: '1020' })
  @IsNotEmpty()
  answer_2: string;

  @ApiProperty({ example: '1019' })
  @IsNotEmpty()
  answer_3: string;

  @ApiProperty({ example: '1018' })
  @IsNotEmpty()
  answer_4: string;

  @ApiProperty({ example: QuestionAnswerEnum.ANSWER_1 })
  @IsEnum(QuestionAnswerEnum)
  @IsNotEmpty()
  correct_answer: QuestionAnswerEnum;

  @ApiPropertyOptional({ example: 'https://annex.com/exemple' })
  @IsOptional()
  answer_annex?: string;

  @ApiProperty({ example: QuestionsLanguageEnum.FRENCH })
  @IsEnum(QuestionsLanguageEnum)
  @IsNotEmpty()
  language: QuestionsLanguageEnum;

  @ApiProperty({ type: QuestionCategory })
  @Type(() => QuestionCategory)
  @IsNotEmpty()
  category: QuestionCategory;
}
