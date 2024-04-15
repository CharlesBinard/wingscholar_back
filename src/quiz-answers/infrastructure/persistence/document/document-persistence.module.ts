import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizAnswerRepository } from '../question-category.repository';
import {
  QuizAnswerSchema,
  QuizAnswerSchemaClass,
} from './entities/quiz-answer.schema';
import { QuizAnswersDocumentRepository } from './repositories/quiz-answer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizAnswerSchemaClass.name, schema: QuizAnswerSchema },
    ]),
  ],
  providers: [
    {
      provide: QuizAnswerRepository,
      useClass: QuizAnswersDocumentRepository,
    },
  ],
  exports: [QuizAnswerRepository],
})
export class DocumentQuizAnswerPersistenceModule {}
