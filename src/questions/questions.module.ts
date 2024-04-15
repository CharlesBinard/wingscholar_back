import { Module } from '@nestjs/common';

import { QuestionsController } from './questions.controller';

import { QuestionCategoriesModule } from '../question-categories/question-categories.module';
import { DocumentQuestionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { QuestionsService } from './questions.service';

const infrastructurePersistenceModule = DocumentQuestionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, QuestionCategoriesModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, infrastructurePersistenceModule],
})
export class QuestionsModule {}
