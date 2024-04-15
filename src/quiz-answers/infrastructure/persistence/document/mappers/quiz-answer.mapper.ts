import { QuestionSchemaClass } from '../../../../../questions/infrastructure/persistence/document/entities/question.schema';
import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/document/mappers/question-category.mapper';
import { QuizSchemaClass } from '../../../../../quizzes/infrastructure/persistence/document/entities/quiz.schema';
import { QuizMapper } from '../../../../../quizzes/infrastructure/persistence/document/mappers/quiz.mapper';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { QuizAnswer } from '../../../../domain/quiz-answer';
import { QuizAnswerSchemaClass } from '../entities/quiz-answer.schema';

export class QuizAnswerMapper {
  static toDomain(raw: QuizAnswerSchemaClass): QuizAnswer {
    const quizAnswer = new QuizAnswer();
    quizAnswer.id = raw._id.toString();
    if (raw.quiz) quizAnswer.quiz = QuizMapper.toDomain(raw.quiz);
    if (raw.question)
      quizAnswer.question = QuestionMapper.toDomain(raw.question);
    if (raw.user) quizAnswer.user = UserMapper.toDomain(raw.user);
    quizAnswer.selectedAnswer = raw.selectedAnswer;
    quizAnswer.isCorrect = raw.isCorrect;

    quizAnswer.createdAt = raw.createdAt;
    quizAnswer.updatedAt = raw.updatedAt;
    quizAnswer.deletedAt = raw.deletedAt;
    return quizAnswer;
  }

  static toPersistence(quizAnswer: QuizAnswer): QuizAnswerSchemaClass {
    const quizAnswerEntity = new QuizAnswerSchemaClass();
    let quiz: QuizSchemaClass | undefined = undefined;

    if (quizAnswer.quiz) {
      quiz = new QuizSchemaClass();
      quiz._id =
        typeof quizAnswer.quiz === 'string'
          ? quizAnswer.quiz
          : quizAnswer.quiz.id.toString();
      quizAnswerEntity.quiz = quiz;
    }

    let question: QuestionSchemaClass | undefined = undefined;

    if (quizAnswer.question) {
      question = new QuestionSchemaClass();
      question._id =
        typeof quizAnswer.question === 'string'
          ? quizAnswer.question
          : quizAnswer.question.id.toString();
      quizAnswerEntity.question = question;
    }

    let user: UserSchemaClass | undefined = undefined;

    if (quizAnswer.user) {
      user = new UserSchemaClass();
      user._id =
        typeof quizAnswer.user === 'string'
          ? quizAnswer.user
          : quizAnswer.user.id.toString();
      quizAnswerEntity.user = user;
    }

    if (quizAnswer.id && typeof quizAnswer.id === 'string') {
      quizAnswerEntity._id = quizAnswer.id;
    }
    quizAnswerEntity.selectedAnswer = quizAnswer.selectedAnswer;
    quizAnswerEntity.isCorrect = quizAnswer.isCorrect;

    quizAnswerEntity.createdAt = quizAnswer.createdAt;
    quizAnswerEntity.updatedAt = quizAnswer.updatedAt;
    quizAnswerEntity.deletedAt = quizAnswer.deletedAt;
    return quizAnswerEntity;
  }
}
