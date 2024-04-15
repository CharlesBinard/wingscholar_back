import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionRepository } from '../question.repository';
import {
  QuestionSchema,
  QuestionSchemaClass,
} from './entities/question.schema';
import { QuestionsDocumentRepository } from './repositories/question.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionSchemaClass.name, schema: QuestionSchema },
    ]),
  ],
  providers: [
    {
      provide: QuestionRepository,
      useClass: QuestionsDocumentRepository,
    },
  ],
  exports: [QuestionRepository],
})
export class DocumentQuestionPersistenceModule {}
