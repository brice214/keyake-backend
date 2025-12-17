import { publicProcedure } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { db } from '@/backend/db';
import { Survey } from '@/backend/db/schema';
import { eq } from 'drizzle-orm';

export const deleteSurveyProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await db.delete(Survey).where(eq(Survey.id, input.id));

    return { success: true };
  });
