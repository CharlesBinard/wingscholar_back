import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { QuizAnswer } from '../../domain/quiz-answer';
import {
  FilterQuizAnswerDto,
  SortQuizAnswerDto,
} from '../../dto/query-quiz-answer.dto';

export abstract class QuizAnswerRepository {
  abstract create(
    data: Omit<QuizAnswer, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<QuizAnswer>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuizAnswerDto | null;
    sortOptions?: SortQuizAnswerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<QuizAnswer[]>;

  abstract findOne(
    fields: EntityCondition<QuizAnswer>,
  ): Promise<NullableType<QuizAnswer>>;

  abstract update(
    id: QuizAnswer['id'],
    payload: DeepPartial<QuizAnswer>,
  ): Promise<QuizAnswer | null>;

  abstract find(fields: EntityCondition<QuizAnswer>): Promise<QuizAnswer[]>;

  abstract softDelete(id: QuizAnswer['id']): Promise<void>;
}
