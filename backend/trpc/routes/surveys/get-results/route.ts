import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/index.js';
import { Answer } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export const getSurveyResultsProcedure = publicProcedure
  .input(z.object({ surveyId: z.string() }))
  .query(async ({ input }) => {
    const answers = await db
      .select()
      .from(Answer)
      .where(eq(Answer.surveyId, input.surveyId));

    const resultsByQuestion = new Map<
      string,
      { votes: Record<string, number>; totalVotes: number }
    >();

    answers.forEach((answer) => {
      const questionId = answer.questionId;
      const value = answer.value;

      if (!resultsByQuestion.has(questionId)) {
        resultsByQuestion.set(questionId, { votes: {}, totalVotes: 0 });
      }

      const result = resultsByQuestion.get(questionId)!;
      result.totalVotes++;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          const key = String(v);
          result.votes[key] = (result.votes[key] || 0) + 1;
        });
      } else {
        const key = String(value);
        result.votes[key] = (result.votes[key] || 0) + 1;
      }
    });

    return Array.from(resultsByQuestion.entries()).map(([questionId, data]) => ({
      questionId,
      votes: data.votes,
      totalVotes: data.totalVotes,
    }));
  });
