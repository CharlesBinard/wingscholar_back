import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { DocumentQuestionCategoryPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { QuestionCategoriesController } from './question-categories.controller';
import { QuestionCategoriesService } from './question-categories.service';

const infrastructurePersistenceModule =
  DocumentQuestionCategoryPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, FilesModule],
  controllers: [QuestionCategoriesController],
  providers: [QuestionCategoriesService],
  exports: [QuestionCategoriesService, infrastructurePersistenceModule],
})
export class QuestionCategoriesModule {}
