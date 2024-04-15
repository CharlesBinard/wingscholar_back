import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Question, QuestionAnswerEnum } from '../../questions/domain/question';

export class AddAnswerQuizDto {
  @ApiProperty({ type: Question, example: { id: '1' } })
  @IsString()
  questionId: string;

  @ApiProperty({ example: QuestionAnswerEnum.ANSWER_1 })
  @IsEnum(QuestionAnswerEnum)
  answer: QuestionAnswerEnum;
}
