import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { QuestionCategoriesService } from '../question-categories/question-categories.service';
import { QuestionAnswerEnum } from '../questions/domain/question';
import { QuestionsLanguageEnum } from '../questions/infrastructure/persistence/document/entities/question.schema';
import { QuestionsService } from '../questions/questions.service';
import { QuizAnswerRepository } from '../quiz-answers/infrastructure/persistence/question-category.repository';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Quiz, QuizStatusEnum, QuizTypeEnum } from './domain/quiz';
import { AddAnswerQuizDto } from './dto/add-answer-quiz.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { FilterQuizDto, SortQuizDto } from './dto/query-question.dto';
import { QuizRepository } from './infrastructure/persistence/quiz.repository';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly quizzesRepository: QuizRepository,
    private readonly questionCategoriesService: QuestionCategoriesService,
    private readonly quizAnswersRepository: QuizAnswerRepository,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(
    createProfileDto: CreateQuizDto & {
      user: Pick<User, 'id'>;
    },
  ): Promise<Quiz> {
    const clonedPayload = {
      ...createProfileDto,
    };

    if (clonedPayload.totalQuestions && clonedPayload.totalQuestions < 1) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          questions: 'totalQuestionsLessThanOne',
        },
      });
    }

    if (clonedPayload.categories) {
      const categoryIds = clonedPayload.categories.map((cat) => cat.id);

      const categories = await this.questionCategoriesService.find({
        id: categoryIds,
      });

      if (clonedPayload.categories.length !== categories.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            categories: 'categoryNotExists',
          },
        });
      }
      clonedPayload.categories = categories;
    }

    if (clonedPayload.type) {
      const typeObject = Object.values(QuizTypeEnum).includes(
        clonedPayload.type,
      );
      if (!typeObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            type: 'typeNotExists',
          },
        });
      }
    }

    const user = await this.usersService.findOne({
      id: clonedPayload.user.id,
    });
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotExists',
        },
      });
    }

    const quiz = await this.quizzesRepository.findOne({
      user: user,
      status: QuizStatusEnum.IN_PROGRESS,
    });

    if (quiz) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          quiz: 'quizInProgress',
        },
      });
    }

    const questions =
      await this.questionsService.findRandomByCategoriesAndLanguage({
        categories: clonedPayload.categories,
        language: QuestionsLanguageEnum.FRENCH,
        limit: clonedPayload.totalQuestions,
      });

    if (questions.length !== clonedPayload.totalQuestions) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'questionsNotEnough',
        },
      });
    }

    clonedPayload.totalQuestions = questions.length;

    return this.quizzesRepository.create({
      ...clonedPayload,
      user: user,
      status: QuizStatusEnum.IN_PROGRESS,
      questions,
    });
  }

  async findOne(fields: EntityCondition<Quiz>): Promise<NullableType<Quiz>> {
    return await this.quizzesRepository.findOne(fields);
  }

  async resume(userId: string): Promise<Quiz | null> {
    const user = await this.usersService.findOne({
      id: userId,
    });
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'userNotExists',
        },
      });
    }

    const quiz = await this.quizzesRepository.findOne({
      user: user.id.toString(),
      status: QuizStatusEnum.IN_PROGRESS,
    });

    if (!quiz) {
      return null;
    }

    return quiz;
  }

  async cancel(userId: string): Promise<Quiz | null> {
    const user = await this.usersService.findOne({
      id: userId,
    });
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'userNotExists',
        },
      });
    }

    const quiz = await this.quizzesRepository.findOne({
      user: user.id.toString(),
      status: QuizStatusEnum.IN_PROGRESS,
    });

    if (!quiz) {
      return null;
    }

    return this.quizzesRepository.update(quiz.id, {
      status: QuizStatusEnum.CANCELLED,
    });
  }

  async addAnswer(
    payload: AddAnswerQuizDto & {
      user: Pick<User, 'id'>;
    },
  ): Promise<Quiz> {
    const clonedPayload = {
      ...payload,
    };

    const user = await this.usersService.findOne({
      id: clonedPayload.user.id,
    });
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotExists',
        },
      });
    }

    const quiz = await this.quizzesRepository.findOne({
      user: user.id.toString(),
      status: QuizStatusEnum.IN_PROGRESS,
    });

    if (!quiz) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          quiz: 'quizNotExists',
        },
      });
    }

    if (
      quiz.answers.find((ans) => {
        const ansId = typeof ans === 'string' ? ans : ans.id.toString();
        return ansId === payload.questionId;
      })
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          question: 'questionAlreadyAnswered',
        },
      });
    }

    const question = await this.questionsService.findOne({
      id: payload.questionId,
    });
    if (!question) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          question: 'questionNotExists',
        },
      });
    }

    if (!Object.values(QuestionAnswerEnum).includes(payload.answer)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          answer: 'invalidAnswer',
        },
      });
    }

    const isCorrect = question.correct_answer === payload.answer;

    const answer = await this.quizAnswersRepository.create({
      user,
      question,
      quiz,
      selectedAnswer: payload.answer,
      isCorrect,
    });

    if (!answer) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          answer: 'answerNotCreated',
        },
      });
    }

    const newAnswers: string[] = [
      ...quiz.answers.map((ans) => {
        if (typeof ans.question === 'string') {
          return ans;
        }
        return ans.id.toString();
      }),
      answer.id.toString(),
    ];

    let updatedQuiz = await this.quizzesRepository.update(quiz.id, {
      answers: newAnswers,
    });

    if (!updatedQuiz) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          quiz: 'quizNotUpdated',
        },
      });
    }

    if (newAnswers.length === quiz.totalQuestions) {
      const numberCorrectAnswer = updatedQuiz.answers.filter((ans) => {
        return typeof ans === 'string' ? false : ans.isCorrect;
      });

      const scorePercentage =
        (numberCorrectAnswer.length / updatedQuiz.totalQuestions) * 100;

      updatedQuiz = await this.quizzesRepository.update(updatedQuiz.id, {
        status: QuizStatusEnum.COMPLETED,
        completedAt: new Date(),
        score: scorePercentage,
      });

      if (!updatedQuiz) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            quiz: 'quizNotUpdated',
          },
        });
      }
    }

    return updatedQuiz;
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    userId,
  }: {
    filterOptions?: FilterQuizDto | null;
    sortOptions?: SortQuizDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<Quiz[]> {
    if (!userId) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotExists',
        },
      });
    }
    return this.quizzesRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      userId,
    });
  }

  async update(
    id: Quiz['id'],
    payload: DeepPartial<Quiz>,
  ): Promise<Quiz | null> {
    const clonedPayload = { ...payload };

    if (clonedPayload.status) {
      const typeObject = Object.values(QuizStatusEnum).includes(
        clonedPayload.status,
      );
      if (!typeObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'statusNotExists',
          },
        });
      }
    }

    return this.quizzesRepository.update(id, clonedPayload);
  }

  async softDelete(id: Quiz['id']): Promise<void> {
    await this.quizzesRepository.softDelete(id);
  }
}
