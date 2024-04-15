import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { QuestionCategory } from '../../domain/question-category';
import {
  FilterQuestionCategoryDto,
  SortQuestionCategoryDto,
} from '../../dto/query-question-category.dto';

export abstract class QuestionCategoryRepository {
  abstract create(
    data: Omit<
      QuestionCategory,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<QuestionCategory>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuestionCategoryDto | null;
    sortOptions?: SortQuestionCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<QuestionCategory[]>;

  abstract find(
    fields: EntityCondition<QuestionCategory>,
  ): Promise<QuestionCategory[]>;

  abstract findOne(
    fields: EntityCondition<QuestionCategory>,
  ): Promise<NullableType<QuestionCategory>>;

  abstract update(
    id: QuestionCategory['id'],
    payload: DeepPartial<QuestionCategory>,
  ): Promise<QuestionCategory | null>;

  abstract softDelete(id: QuestionCategory['id']): Promise<void>;
}
