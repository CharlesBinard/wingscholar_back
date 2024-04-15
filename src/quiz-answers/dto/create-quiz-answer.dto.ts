import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { QuestionAnswerEnum } from '../../questions/domain/question';

export class CreateQuizAnswerDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @ApiProperty({ example: QuestionAnswerEnum.ANSWER_1 })
  @IsEnum(QuestionAnswerEnum)
  @IsNotEmpty()
  selectedAnswer: QuestionAnswerEnum;
}
