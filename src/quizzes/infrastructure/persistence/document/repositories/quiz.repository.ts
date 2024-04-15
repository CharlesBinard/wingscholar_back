import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Quiz } from '../../../../domain/quiz';
import { FilterQuizDto, SortQuizDto } from '../../../../dto/query-question.dto';
import { QuizRepository } from '../../quiz.repository';
import { QuizSchemaClass } from '../entities/quiz.schema';
import { QuizMapper } from '../mappers/quiz.mapper';

@Injectable()
export class QuizzesDocumentRepository implements QuizRepository {
  constructor(
    @InjectModel(QuizSchemaClass.name)
    private readonly quizzesModel: Model<QuizSchemaClass>,
  ) {}

  async create(data: Quiz): Promise<Quiz> {
    const persistenceModel = QuizMapper.toPersistence(data);
    const createdQuiz = new this.quizzesModel(persistenceModel);
    const quizObject = await createdQuiz.save();
    await quizObject.populate(['categories', 'questions', 'answers']);
    return QuizMapper.toDomain(quizObject);
  }

  async findManyWithPagination({
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
    const where: EntityCondition<Quiz> = {};
    where['user'] = userId;
    if (filterOptions?.status) {
      where['status'] = filterOptions.status;
    }

    if (filterOptions?.type) {
      where['type'] = filterOptions.type;
    }

    const questionObjects = await this.quizzesModel
      .find(where)
      .populate('categories')
      .populate('questions')
      .populate('answers')
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
      QuizMapper.toDomain(questionObject),
    );
  }

  async findOne(fields: EntityCondition<Quiz>): Promise<NullableType<Quiz>> {
    const quizObject = await this.quizzesModel
      .findOne(domainToDocumentCondition(fields))
      .populate('categories')
      .populate('questions')
      .populate('answers');
    return quizObject ? QuizMapper.toDomain(quizObject) : null;
  }

  async update(id: Quiz['id'], payload: Partial<Quiz>): Promise<Quiz | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const quiz = await this.quizzesModel.findOne(filter);

    if (!quiz) {
      return null;
    }

    const quizObject = await this.quizzesModel
      .findOneAndUpdate(
        filter,
        QuizMapper.toPersistence({
          ...QuizMapper.toDomain(quiz),
          ...clonedPayload,
        }),
        { new: true },
      )
      .populate('categories')
      .populate('questions')
      .populate('answers');

    return quizObject ? QuizMapper.toDomain(quizObject) : null;
  }

  async softDelete(id: Quiz['id']): Promise<void> {
    await this.quizzesModel.deleteOne({
      _id: id.toString(),
    });
  }
}
