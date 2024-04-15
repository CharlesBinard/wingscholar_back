import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FilterUserDto } from '../../users/dto/query-user.dto';
import {
  QuestionCategory,
  QuestionCategoryExamEnum,
} from '../domain/question-category';

export class FilterQuestionCategoryDto {
  @ApiProperty({ enum: QuestionCategoryExamEnum })
  @IsOptional()
  exam?: QuestionCategoryExamEnum | null;
}

export class SortQuestionCategoryDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof QuestionCategory;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryQuestionCategoryDto {
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
    value
      ? plainToInstance(FilterQuestionCategoryDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterQuestionCategoryDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortQuestionCategoryDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortQuestionCategoryDto)
  sort?: SortQuestionCategoryDto[] | null;
}
