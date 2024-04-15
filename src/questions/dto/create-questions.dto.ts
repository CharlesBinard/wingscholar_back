import { Type } from 'class-transformer';
import { ArrayNotEmpty } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class CreateQuestionsDto {
  @ArrayNotEmpty()
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
