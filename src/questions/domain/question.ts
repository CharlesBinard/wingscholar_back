import { QuestionCategory } from '../../question-categories/domain/question-category';
import { QuestionsLanguageEnum } from '../infrastructure/persistence/document/entities/question.schema';

export enum QuestionAnswerEnum {
  ANSWER_1 = 'answer_1',
  ANSWER_2 = 'answer_2',
  ANSWER_3 = 'answer_3',
  ANSWER_4 = 'answer_4',
}

export class Question {
  id: string | number;

  name: string;

  explanation?: string | null;

  annex?: string | null;

  answer_1: string;

  answer_2: string;

  answer_3: string;

  answer_4: string;

  correct_answer?: QuestionAnswerEnum;

  answer_annex?: string | null;

  language: QuestionsLanguageEnum;

  category: QuestionCategory | string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}
