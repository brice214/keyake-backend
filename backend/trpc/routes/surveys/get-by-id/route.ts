import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../../db/index.js';
import { Survey, Question } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export const getSurveyByIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const [survey] = await db
      .select()
      .from(Survey)
      .where(eq(Survey.id, input.id))
      .limit(1);

    if (!survey) {
      throw new Error('Survey not found');
    }

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
  });
