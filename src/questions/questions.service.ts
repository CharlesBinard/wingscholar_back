import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { QuestionCategory } from '../question-categories/domain/question-category';
import { QuestionCategoryRepository } from '../question-categories/infrastructure/persistence/question-category.repository';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Question, QuestionAnswerEnum } from './domain/question';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FilterQuestionDto, SortQuestionDto } from './dto/query-question.dto';
import { QuestionsLanguageEnum } from './infrastructure/persistence/document/entities/question.schema';
import { QuestionRepository } from './infrastructure/persistence/question.repository';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionRepository,
    private readonly questionCategoriesRepository: QuestionCategoryRepository,
  ) {}

  async findRandomByCategoriesAndLanguage({
    categories,
    language,
    limit,
  }: {
    categories: Pick<QuestionCategory, 'id'>[];
    language: Question['language'];
    limit: number;
  }): Promise<Question[]> {
    return this.questionsRepository.findRandomByCategoriesAndLanguage({
      categories,
      language,
      limit,
    });
  }

  async create(createProfileDto: CreateQuestionDto): Promise<Question> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.category?.id) {
      const categoryObject = await this.questionCategoriesRepository.findOne({
        id: clonedPayload.category.id,
      });
      if (!categoryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            category: 'categoryNotExists',
          },
        });
      }
      clonedPayload.category = categoryObject;
    }

    if (clonedPayload.correct_answer) {
      const roleObject = Object.values(QuestionAnswerEnum).includes(
        clonedPayload.correct_answer,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'questionCorrectAnswerNotExists',
          },
        });
      }
    }
    if (clonedPayload.language) {
      const roleObject = Object.values(QuestionsLanguageEnum).includes(
        clonedPayload.language,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'languageNotExists',
          },
        });
      }
    }

    return this.questionsRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuestionDto | null;
    sortOptions?: SortQuestionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Question[]> {
    return this.questionsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Question>): Promise<NullableType<Question>> {
    return this.questionsRepository.findOne(fields);
  }

  async update(
    id: Question['id'],
    payload: DeepPartial<Question>,
  ): Promise<Question | null> {
    const clonedPayload = { ...payload };

    if (clonedPayload.category) {
      const categoryObject = await this.questionCategoriesRepository.findOne({
        id:
          typeof clonedPayload.category === 'string'
            ? clonedPayload.category
            : clonedPayload.category.id,
      });
      if (!categoryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            category: 'categoryNotExists',
          },
        });
      }
      clonedPayload.category = categoryObject;
    }

    if (clonedPayload.correct_answer) {
      const roleObject = Object.values(QuestionAnswerEnum).includes(
        clonedPayload.correct_answer,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'questionCorrectAnswerNotExists',
          },
        });
      }
    }
    if (clonedPayload.language) {
      const roleObject = Object.values(QuestionsLanguageEnum).includes(
        clonedPayload.language,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'languageNotExists',
          },
        });
      }
    }

    return this.questionsRepository.update(id, clonedPayload);
  }

  async softDelete(id: Question['id']): Promise<void> {
    await this.questionsRepository.softDelete(id);
  }
}
