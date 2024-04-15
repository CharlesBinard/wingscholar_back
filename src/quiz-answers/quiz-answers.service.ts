import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { QuestionAnswerEnum } from '../questions/domain/question';
import { QuestionsService } from '../questions/questions.service';
import { QuizStatusEnum } from '../quizzes/domain/quiz';
import { QuizRepository } from '../quizzes/infrastructure/persistence/quiz.repository';
import { UsersService } from '../users/users.service';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { QuizAnswer } from './domain/quiz-answer';
import {
  FilterQuizAnswerDto,
  SortQuizAnswerDto,
} from './dto/query-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { QuizAnswerRepository } from './infrastructure/persistence/question-category.repository';

@Injectable()
export class QuizAnswersService {
  constructor(
    private readonly quizAnswersRepository: QuizAnswerRepository,
    private readonly quizRepository: QuizRepository,
    private readonly questionsService: QuestionsService,
    private readonly usersService: UsersService,
  ) {}

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuizAnswerDto | null;
    sortOptions?: SortQuizAnswerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<QuizAnswer[]> {
    return this.quizAnswersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(
    fields: EntityCondition<QuizAnswer>,
  ): Promise<NullableType<QuizAnswer>> {
    return this.quizAnswersRepository.findOne(fields);
  }

  async update(
    id: QuizAnswer['id'],
    payload: UpdateQuizAnswerDto,
  ): Promise<QuizAnswer | null> {
    const clonedPayload = { ...payload };

    const quizObject = await this.quizRepository.findOne({
      id: clonedPayload.quiz.id,
    });
    if (!quizObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'quizNotExists',
        },
      });
    }

    if (quizObject.status !== QuizStatusEnum.IN_PROGRESS) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'quizNotInProgress',
        },
      });
    }

    const selectedAnswerObject = Object.values(QuestionAnswerEnum).includes(
      clonedPayload.selectedAnswer,
    );
    if (!selectedAnswerObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          role: 'selectedAnswerNotExists',
        },
      });
    }

    const questionObject = await this.questionsService.findOne({
      id: clonedPayload.question.id,
    });
    if (!questionObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'questionNotExists',
        },
      });
    }

    const isCorrect =
      questionObject.correct_answer === clonedPayload.selectedAnswer;

    return this.quizAnswersRepository.update(id, {
      ...clonedPayload,
      isCorrect,
    });
  }

  async softDelete(id: QuizAnswer['id']): Promise<void> {
    await this.quizAnswersRepository.softDelete(id);
  }
}
