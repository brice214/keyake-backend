import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/index.js';
import { Survey } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export const deleteSurveyProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await db.delete(Survey).where(eq(Survey.id, input.id));

    return { success: true };
  });
