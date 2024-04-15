import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuestionCategory } from '../../../../../question-categories/domain/question-category';
import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Question } from '../../../../domain/question';
import {
  FilterQuestionDto,
  SortQuestionDto,
} from '../../../../dto/query-question.dto';
import { QuestionRepository } from '../../question.repository';
import { QuestionSchemaClass } from '../entities/question.schema';
import { QuestionMapper } from '../mappers/question-category.mapper';

@Injectable()
export class QuestionsDocumentRepository implements QuestionRepository {
  constructor(
    @InjectModel(QuestionSchemaClass.name)
    private readonly questionsModel: Model<QuestionSchemaClass>,
  ) {}

  async create(data: Question): Promise<Question> {
    const persistenceModel = QuestionMapper.toPersistence(data);
    const createdQuestion = new this.questionsModel(persistenceModel);
    const questionObject = await createdQuestion.save();
    return QuestionMapper.toDomain(questionObject);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuestionDto | null;
    sortOptions?: SortQuestionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Question[]> {
    const where: EntityCondition<Question> = {};
    if (filterOptions?.categories?.length) {
      where['role.id'] = {
        $in: filterOptions.categories.map((category) => category.id),
      };
    }

    const questionObjects = await this.questionsModel
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

    return questionObjects.map((questionObject) =>
      QuestionMapper.toDomain(questionObject),
    );
  }

  async findRandomByCategoriesAndLanguage({
    categories,
    language,
    limit,
  }: {
    categories: Pick<QuestionCategory, 'id'>[];
    language: Question['language'];
    limit: number;
  }): Promise<Question[]> {
    const ids = categories.map((cat) => new mongoose.Types.ObjectId(cat.id));
    const randomQuestions = await this.questionsModel.aggregate([
      { $match: { category: { $in: ids }, language: language } },
      { $sample: { size: limit } },
    ]);
    return randomQuestions.map((doc) => QuestionMapper.toDomain(doc));
  }

  async findOne(
    fields: EntityCondition<Question>,
  ): Promise<NullableType<Question>> {
    const questionObject = await this.questionsModel.findOne(
      domainToDocumentCondition(fields),
    );

    return questionObject ? QuestionMapper.toDomain(questionObject) : null;
  }

  async update(
    id: Question['id'],
    payload: Partial<Question>,
  ): Promise<Question | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const question = await this.questionsModel.findOne(filter);

    if (!question) {
      return null;
    }

    const questionObject = await this.questionsModel.findOneAndUpdate(
      filter,
      QuestionMapper.toPersistence({
        ...QuestionMapper.toDomain(question),
        ...clonedPayload,
      }),
    );

    return questionObject ? QuestionMapper.toDomain(questionObject) : null;
  }

  async softDelete(id: Question['id']): Promise<void> {
    await this.questionsModel.deleteOne({
      _id: id.toString(),
    });
  }
}
