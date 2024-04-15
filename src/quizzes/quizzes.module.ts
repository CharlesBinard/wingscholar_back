import { Module, forwardRef } from '@nestjs/common';

import { QuizzesController } from './quizzes.controller';

import { QuestionCategoriesModule } from '../question-categories/question-categories.module';
import { QuestionsModule } from '../questions/questions.module';
import { QuizAnswersModule } from '../quiz-answers/quiz-answers.module';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';
import { DocumentQuizPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { QuizzesService } from './quizzes.service';

const infrastructurePersistenceModule = DocumentQuizPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    QuestionCategoriesModule,
    UsersModule,
    QuestionsModule,
    SessionModule,
    forwardRef(() => QuizAnswersModule), // Wrapped in forwardRef()
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService, infrastructurePersistenceModule],
})
export class QuizzesModule {}
