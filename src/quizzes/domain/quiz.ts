import { QuestionCategory } from '../../question-categories/domain/question-category';
import { Question } from '../../questions/domain/question';
import { QuizAnswer } from '../../quiz-answers/domain/quiz-answer';
import { User } from '../../users/domain/user';

export enum QuizTypeEnum {
  EXAM = 'EXAM',
  TRAINING = 'TRAINING',
}

export enum QuizStatusEnum {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
}

export class Quiz {
  id: string | number;

  user: User | string;

  type: QuizTypeEnum;

  questions: Question[] | string[];

  answers: QuizAnswer[] | string[];

  status: QuizStatusEnum;

  score?: number | null;

  categories: QuestionCategory[] | string[];

  totalQuestions: number;

  completedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
