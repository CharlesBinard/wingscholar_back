import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Quiz, QuizStatusEnum, QuizTypeEnum } from '../domain/quiz';

export class FilterQuizDto {
  @ApiPropertyOptional({ type: QuizStatusEnum })
  @IsOptional()
  status?: QuizStatusEnum | null;

  @ApiPropertyOptional({ type: QuizTypeEnum })
  @IsOptional()
  type?: QuizTypeEnum | null;
}

export class SortQuizDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Quiz;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryQuizDto {
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
    value ? plainToInstance(FilterQuizDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterQuizDto)
  filters?: FilterQuizDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortQuizDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortQuizDto)
  sort?: SortQuizDto[] | null;
}
