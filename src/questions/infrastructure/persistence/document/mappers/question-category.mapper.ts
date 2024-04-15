import { QuestionCategorySchemaClass } from '../../../../../question-categories/infrastructure/persistence/document/entities/question-category.schema';
import { QuestionCategoryMapper } from '../../../../../question-categories/infrastructure/persistence/document/mappers/question-category.mapper';
import { Question } from '../../../../domain/question';
import { QuestionSchemaClass } from '../entities/question.schema';

export class QuestionMapper {
  static toDomain(raw: QuestionSchemaClass): Question {
    const question = new Question();
    question.id = raw._id.toString();
    question.name = raw.name;
    question.explanation = raw.explanation;
    question.annex = raw.annex;
    question.answer_1 = raw.answer_1;
    question.answer_2 = raw.answer_2;
    question.answer_3 = raw.answer_3;
    question.answer_4 = raw.answer_4;

    question.correct_answer = raw.correct_answer;

    question.answer_annex = raw.answer_annex;
    question.language = raw.language;
    if (raw.category) {
      question.category = QuestionCategoryMapper.toDomain(raw.category);
    }

    question.createdAt = raw.createdAt;
    question.updatedAt = raw.updatedAt;
    question.deletedAt = raw.deletedAt;

    return question;
  }

  static toPersistence(question: Question): QuestionSchemaClass {
    let category: QuestionCategorySchemaClass | undefined = undefined;
    category = new QuestionCategorySchemaClass();
    category._id =
      typeof question.category === 'string'
        ? question.category
        : question.category.id.toString();

    const questionEntity = new QuestionSchemaClass();
    if (question.id && typeof question.id === 'string') {
      questionEntity._id = question.id;
    }
    questionEntity.name = question.name;
    questionEntity.explanation = question.explanation;
    questionEntity.annex = question.annex;
    questionEntity.answer_1 = question.answer_1;
    questionEntity.answer_2 = question.answer_2;
    questionEntity.answer_3 = question.answer_3;
    questionEntity.answer_4 = question.answer_4;
    questionEntity.correct_answer = question.correct_answer;
    questionEntity.answer_annex = question.answer_annex;
    questionEntity.language = question.language;
    questionEntity.category = category;

    questionEntity.createdAt = question.createdAt;
    questionEntity.updatedAt = question.updatedAt;
    questionEntity.deletedAt = question.deletedAt;

    return questionEntity;
  }
}
