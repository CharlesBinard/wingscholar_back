import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Question, QuestionAnswerEnum } from '../../questions/domain/question';
import { Quiz } from '../../quizzes/domain/quiz';
import { CreateQuizAnswerDto } from './create-quiz-answer.dto';

export class UpdateQuizAnswerDto extends PartialType(CreateQuizAnswerDto) {
  @ApiProperty({ type: Quiz })
  @IsNotEmpty()
  @Type(() => Quiz)
  quiz: Quiz;

  @ApiProperty({ type: Question })
  @IsNotEmpty()
  @Type(() => Question)
  question: Question;

  @ApiProperty({ example: QuestionAnswerEnum.ANSWER_1 })
  @IsEnum(QuestionAnswerEnum)
  @IsNotEmpty()
  selectedAnswer: QuestionAnswerEnum;
}
