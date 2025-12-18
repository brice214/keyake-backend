import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/index.js';
import { Answer, CompleteSurvey, Survey, User } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export const submitAnswersProcedure = publicProcedure
  .input(
    z.object({
      surveyId: z.string(),
      userId: z.string(),
      answers: z.array(
        z.object({
          questionId: z.string(),
          value: z.union([z.string(), z.array(z.string()), z.number(), z.boolean()]),
        })
      ),
    })
  )
  .mutation(async ({ input }) => {
    const answerValues = input.answers.map((answer) => ({
      surveyId: input.surveyId,
      questionId: answer.questionId,
      userId: input.userId,
      value: answer.value,
      createdAt: new Date(),
    }));

    await db.insert(Answer).values(answerValues);

    await db.insert(CompleteSurvey).values({
      userId: input.userId,
      surveyId: input.surveyId,
      completedAt: new Date(),
    });

    await db
      .update(Survey)
      .set({
        participantCount: db
          .select({ count: CompleteSurvey.id })
          .from(CompleteSurvey)
          .where(eq(CompleteSurvey.surveyId, input.surveyId)) as any,
      })
      .where(eq(Survey.id, input.surveyId));

    const [user] = await db.select().from(User).where(eq(User.id, input.userId));
    
    if (user) {
      await db
        .update(User)
        .set({
          surveysCompleted: user.surveysCompleted + 1,
          points: user.points + 10,
        })
        .where(eq(User.id, input.userId));
    }

    return { success: true };
  });
