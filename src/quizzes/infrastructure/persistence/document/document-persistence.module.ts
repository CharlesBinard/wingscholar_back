import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizRepository } from '../quiz.repository';
import { QuizSchema, QuizSchemaClass } from './entities/quiz.schema';
import { QuizzesDocumentRepository } from './repositories/quiz.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizSchemaClass.name, schema: QuizSchema },
    ]),
  ],
  providers: [
    {
      provide: QuizRepository,
      useClass: QuizzesDocumentRepository,
    },
  ],
  exports: [QuizRepository],
})
export class DocumentQuizPersistenceModule {}
