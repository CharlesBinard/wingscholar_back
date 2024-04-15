import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { upperCaseTransformer } from '../../utils/transformers/upper-case.transformer';
import { QuestionCategoryExamEnum } from '../domain/question-category';

export class CreateQuestionCategoryDto {
  @ApiProperty({ example: 'COMMUNICATION' })
  @Transform(upperCaseTransformer)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: QuestionCategoryExamEnum,
    example: QuestionCategoryExamEnum.PPL,
  })
  @IsNotEmpty()
  exam: QuestionCategoryExamEnum;

  @ApiPropertyOptional({ example: '#fff' })
  @MinLength(3)
  color?: string;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  picture?: FileDto | null;
}
