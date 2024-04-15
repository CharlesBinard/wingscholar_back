import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionCategoryRepository } from '../question-category.repository';
import {
  QuestionCategorySchema,
  QuestionCategorySchemaClass,
} from './entities/question-category.schema';
import { QuestionCategoriesDocumentRepository } from './repositories/question-category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionCategorySchemaClass.name,
        schema: QuestionCategorySchema,
      },
    ]),
  ],
  providers: [
    {
      provide: QuestionCategoryRepository,
      useClass: QuestionCategoriesDocumentRepository,
    },
  ],
  exports: [QuestionCategoryRepository],
})
export class DocumentQuestionCategoryPersistenceModule {}
