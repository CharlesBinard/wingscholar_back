import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { QuizAnswer } from '../../../../domain/quiz-answer';
import {
  FilterQuizAnswerDto,
  SortQuizAnswerDto,
} from '../../../../dto/query-quiz-answer.dto';
import { QuizAnswerRepository } from '../../question-category.repository';
import { QuizAnswerSchemaClass } from '../entities/quiz-answer.schema';
import { QuizAnswerMapper } from '../mappers/quiz-answer.mapper';

@Injectable()
export class QuizAnswersDocumentRepository implements QuizAnswerRepository {
  constructor(
    @InjectModel(QuizAnswerSchemaClass.name)
    private readonly quizAnswersModel: Model<QuizAnswerSchemaClass>,
  ) {}

  async create(data: QuizAnswer): Promise<QuizAnswer> {
    const persistenceModel = QuizAnswerMapper.toPersistence(data);
    const createdQuizAnswer = new this.quizAnswersModel(persistenceModel);
    const quizAnswerObject = await createdQuizAnswer.save();
    return QuizAnswerMapper.toDomain(quizAnswerObject);
  }

  async find(fields: EntityCondition<QuizAnswer>): Promise<QuizAnswer[]> {
    const quizAnswerObjects = await this.quizAnswersModel.find(
      domainToDocumentCondition(fields),
    );

    return quizAnswerObjects.map((quizAnswerObject) =>
      QuizAnswerMapper.toDomain(quizAnswerObject),
    );
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterQuizAnswerDto | null;
    sortOptions?: SortQuizAnswerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<QuizAnswer[]> {
    const where: EntityCondition<QuizAnswer> = {};
    if (filterOptions?.isCorrect) {
      where['isCorrect'] = filterOptions?.isCorrect;
    }

    const quizAnswerObjects = await this.quizAnswersModel
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

    return quizAnswerObjects.map((quizAnswerObject) =>
      QuizAnswerMapper.toDomain(quizAnswerObject),
    );
  }

  async findOne(
    fields: EntityCondition<QuizAnswer>,
  ): Promise<NullableType<QuizAnswer>> {
    const quizAnswerObject = await this.quizAnswersModel.findOne(
      domainToDocumentCondition(fields),
    );

    return quizAnswerObject
      ? QuizAnswerMapper.toDomain(quizAnswerObject)
      : null;
  }

  async update(
    id: QuizAnswer['id'],
    payload: Partial<QuizAnswer>,
  ): Promise<QuizAnswer | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const quizAnswer = await this.quizAnswersModel.findOne(filter);

    if (!quizAnswer) {
      return null;
    }

    const quizAnswerObject = await this.quizAnswersModel.findOneAndUpdate(
      filter,
      QuizAnswerMapper.toPersistence({
        ...QuizAnswerMapper.toDomain(quizAnswer),
        ...clonedPayload,
      }),
    );

    return quizAnswerObject
      ? QuizAnswerMapper.toDomain(quizAnswerObject)
      : null;
  }

  async softDelete(id: QuizAnswer['id']): Promise<void> {
    await this.quizAnswersModel.deleteOne({
      _id: id.toString(),
    });
  }
}
