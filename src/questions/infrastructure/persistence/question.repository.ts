import { QuestionCategory } from '../../../question-categories/domain/question-category';
import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Question } from '../../domain/question';
import {
  FilterQuestionDto,
  SortQuestionDto,
} from '../../dto/query-question.dto';

export abstract class QuestionRepository {
  abstract create(
    data: Omit<Question, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Question>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuestionDto | null;
    sortOptions?: SortQuestionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Question[]>;

  abstract findOne(
    fields: EntityCondition<Question>,
  ): Promise<NullableType<Question>>;

  abstract findRandomByCategoriesAndLanguage({
    categories,
    language,
    limit,
  }: {
    categories: Pick<QuestionCategory, 'id'>[];
    language: Question['language'];
    limit: number;
  }): Promise<Question[]>;

  abstract update(
    id: Question['id'],
    payload: DeepPartial<Question>,
  ): Promise<Question | null>;

  abstract softDelete(id: Question['id']): Promise<void>;
}
