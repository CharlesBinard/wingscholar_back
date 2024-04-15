import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Quiz } from '../../domain/quiz';
import { FilterQuizDto, SortQuizDto } from '../../dto/query-question.dto';

export abstract class QuizRepository {
  abstract create(
    data: Omit<
      Quiz,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'score' | 'answers'
    >,
  ): Promise<Quiz>;

  abstract findOne(fields: EntityCondition<Quiz>): Promise<NullableType<Quiz>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    userId,
  }: {
    filterOptions?: FilterQuizDto | null;
    sortOptions?: SortQuizDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<Quiz[]>;

  abstract update(
    id: Quiz['id'],
    payload: DeepPartial<Quiz>,
  ): Promise<Quiz | null>;

  abstract softDelete(id: Quiz['id']): Promise<void>;
}
