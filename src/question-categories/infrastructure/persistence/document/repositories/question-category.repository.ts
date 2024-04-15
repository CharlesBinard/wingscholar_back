import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { QuestionCategory } from '../../../../domain/question-category';
import {
  FilterQuestionCategoryDto,
  SortQuestionCategoryDto,
} from '../../../../dto/query-question-category.dto';
import { QuestionCategoryRepository } from '../../question-category.repository';
import { QuestionCategorySchemaClass } from '../entities/question-category.schema';
import { QuestionCategoryMapper } from '../mappers/question-category.mapper';

@Injectable()
export class QuestionCategoriesDocumentRepository
  implements QuestionCategoryRepository
{
  constructor(
    @InjectModel(QuestionCategorySchemaClass.name)
    private readonly questionCategoriesModel: Model<QuestionCategorySchemaClass>,
  ) {}

  async create(data: QuestionCategory): Promise<QuestionCategory> {
    const persistenceModel = QuestionCategoryMapper.toPersistence(data);
    const createdQuestionCategory = new this.questionCategoriesModel(
      persistenceModel,
    );
    const questionCategoryObject = await createdQuestionCategory.save();
    return QuestionCategoryMapper.toDomain(questionCategoryObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuestionCategoryDto | null;
    sortOptions?: SortQuestionCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<QuestionCategory[]> {
    const where: EntityCondition<QuestionCategory> = {};
    if (filterOptions?.exam) {
      where['exam'] = filterOptions?.exam;
    }

    const questionCategoryObjects = await this.questionCategoriesModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return questionCategoryObjects.map((questionCategoryObject) =>
      QuestionCategoryMapper.toDomain(questionCategoryObject),
    );
  }

  async find(
    fields: EntityCondition<QuestionCategory>,
  ): Promise<QuestionCategory[]> {
    const questionCategoryObjects = await this.questionCategoriesModel.find(
      domainToDocumentCondition(fields),
    );
    return questionCategoryObjects.map((questionCategoryObject) =>
      QuestionCategoryMapper.toDomain(questionCategoryObject),
    );
  }

  async findOne(
    fields: EntityCondition<QuestionCategory>,
  ): Promise<NullableType<QuestionCategory>> {
    const questionCategoryObject = await this.questionCategoriesModel.findOne(
      domainToDocumentCondition(fields),
    );
    return questionCategoryObject
      ? QuestionCategoryMapper.toDomain(questionCategoryObject)
      : null;
  }

  async update(
    id: QuestionCategory['id'],
    payload: Partial<QuestionCategory>,
  ): Promise<QuestionCategory | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const questionCategory = await this.questionCategoriesModel.findOne(filter);

    if (!questionCategory) {
      return null;
    }

    const questionCategoryObject =
      await this.questionCategoriesModel.findOneAndUpdate(
        filter,
        QuestionCategoryMapper.toPersistence({
          ...QuestionCategoryMapper.toDomain(questionCategory),
          ...clonedPayload,
        }),
      );

    return questionCategoryObject
      ? QuestionCategoryMapper.toDomain(questionCategoryObject)
      : null;
  }

  async softDelete(id: QuestionCategory['id']): Promise<void> {
    await this.questionCategoriesModel.deleteOne({
      _id: id.toString(),
    });
  }
}
