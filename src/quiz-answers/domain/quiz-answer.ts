import { Question, QuestionAnswerEnum } from '../../questions/domain/question';
import { Quiz } from '../../quizzes/domain/quiz';
import { User } from '../../users/domain/user';

export class QuizAnswer {
  id: number | string;

  quiz: Quiz | string;

  question: Question | string;

  selectedAnswer: QuestionAnswerEnum;

  isCorrect?: boolean | null;

  user: User | string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
