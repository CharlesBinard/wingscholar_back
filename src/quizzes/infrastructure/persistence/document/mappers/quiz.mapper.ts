import { QuestionCategorySchemaClass } from '../../../../../question-categories/infrastructure/persistence/document/entities/question-category.schema';
import { QuestionCategoryMapper } from '../../../../../question-categories/infrastructure/persistence/document/mappers/question-category.mapper';
import { QuestionSchemaClass } from '../../../../../questions/infrastructure/persistence/document/entities/question.schema';
import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/document/mappers/question-category.mapper';
import { QuizAnswerSchemaClass } from '../../../../../quiz-answers/infrastructure/persistence/document/entities/quiz-answer.schema';
import { QuizAnswerMapper } from '../../../../../quiz-answers/infrastructure/persistence/document/mappers/quiz-answer.mapper';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { Quiz, QuizStatusEnum, QuizTypeEnum } from '../../../../domain/quiz';
import { QuizSchemaClass } from '../entities/quiz.schema';

export class QuizMapper {
  static toDomain(raw: QuizSchemaClass): Quiz {
    const quiz = new Quiz();

    const showData =
      raw.type === QuizTypeEnum.TRAINING ||
      raw.status !== QuizStatusEnum.IN_PROGRESS;

    quiz.id = raw._id.toString();

    if (raw.user) {
      quiz.user = UserMapper.toDomain(raw.user);
    }

    quiz.type = raw.type;
    if (raw.questions && raw.questions.length > 0) {
      quiz.questions = raw.questions.map((question) => {
        return QuestionMapper.toDomain(question);
      });
    }

    quiz.answers = [];
    if (raw.answers && raw.answers.length > 0) {
      quiz.answers = raw.answers.map((answer) => {
        return QuizAnswerMapper.toDomain(answer);
      });
    }

    quiz.status = raw.status;
    quiz.score = showData ? raw.score : undefined;

    if (raw.categories && raw.categories.length > 0) {
      quiz.categories = raw.categories.map((category) => {
        return QuestionCategoryMapper.toDomain(category);
      });
    }

    quiz.totalQuestions = raw.totalQuestions;

    quiz.completedAt = raw.completedAt;
    quiz.createdAt = raw.createdAt;
    quiz.updatedAt = raw.updatedAt;
    quiz.deletedAt = raw.deletedAt;
    return quiz;
  }

  static toPersistence(quiz: Quiz): QuizSchemaClass {
    const user = new UserSchemaClass();
    user._id =
      typeof quiz.user !== 'string'
        ? quiz.user.id.toString()
        : quiz.user.toString();

    const questions = quiz.questions.map((q) => {
      const question = new QuestionSchemaClass();
      question._id = typeof q === 'string' ? q : q.id.toString();
      return question;
    });

    const answers = quiz.answers?.map((q) => {
      const answer = new QuizAnswerSchemaClass();
      answer._id = typeof q === 'string' ? q : q.id.toString();
      return answer;
    });

    const categories = quiz.categories.map((q) => {
      const category = new QuestionCategorySchemaClass();
      category._id = typeof q === 'string' ? q : q.id.toString();
      return category;
    });

    const quizEntity = new QuizSchemaClass();
    if (quiz.id && typeof quiz.id === 'string') {
      quizEntity._id = quiz.id;
    }

    quizEntity.user = user;
    quizEntity.type = quiz.type;
    quizEntity.questions = questions;
    quizEntity.answers = answers;
    quizEntity.status = quiz.status;
    quizEntity.score = quiz.score;
    quizEntity.categories = categories;
    quizEntity.totalQuestions = quiz.totalQuestions;

    quizEntity.completedAt = quiz.completedAt;
    quizEntity.createdAt = quiz.createdAt;
    quizEntity.updatedAt = quiz.updatedAt;
    quizEntity.deletedAt = quiz.deletedAt;
    return quizEntity;
  }
}
