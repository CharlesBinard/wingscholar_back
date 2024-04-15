import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateQuestionCategoryDto } from './create-question-category.dto';

import { Transform } from 'class-transformer';
import { IsOptional, MinLength } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { upperCaseTransformer } from '../../utils/transformers/upper-case.transformer';
import { QuestionCategoryExamEnum } from '../domain/question-category';

export class UpdateQuestionCategoryDto extends PartialType(
  CreateQuestionCategoryDto,
) {
  @ApiPropertyOptional({ example: 'Communication' })
  @Transform(upperCaseTransformer)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '#fff' })
  @IsOptional()
  @MinLength(3)
  color?: string;

  @ApiPropertyOptional({
    enum: QuestionCategoryExamEnum,
    example: QuestionCategoryExamEnum.PPL,
  })
  @IsOptional()
  exam: QuestionCategoryExamEnum;

  @ApiPropertyOptional({ type: FileDto })
  @IsOptional()
  picture?: FileDto | null;
}
