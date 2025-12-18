import { publicProcedure } from '../../create-context.js';
import { db } from '../../../db/index.js';
import { Survey, Question } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export const listSurveysProcedure = publicProcedure.query(async () => {
  const surveys = await db.select().from(Survey);

  const surveysWithQuestions = await Promise.all(
    surveys.map(async (survey) => {
      const questions = await db
        .select()
        .from(Question)
        .where(eq(Question.surveyId, survey.id));

      return {
        ...survey,
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options as string[] | undefined,
          min: q.min ?? undefined,
          max: q.max ?? undefined,
          required: q.required,
        })),
      };
    })
  );

  return surveysWithQuestions;
});
