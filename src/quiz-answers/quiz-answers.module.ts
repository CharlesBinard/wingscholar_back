import { Module, forwardRef } from '@nestjs/common';

import { QuizAnswersController } from './quiz-answers.controller';

import { QuestionsModule } from '../questions/questions.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { UsersModule } from '../users/users.module';
import { DocumentQuizAnswerPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { QuizAnswersService } from './quiz-answers.service';

const infrastructurePersistenceModule = DocumentQuizAnswerPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    UsersModule,
    QuestionsModule,
    forwardRef(() => QuizzesModule), // Wrapped in forwardRef()
  ],
  controllers: [QuizAnswersController],
  providers: [QuizAnswersService],
  exports: [QuizAnswersService, infrastructurePersistenceModule],
})
export class QuizAnswersModule {}
