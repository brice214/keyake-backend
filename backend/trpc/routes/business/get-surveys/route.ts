import { publicProcedure } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { db } from '@/backend/db';
import { Survey } from '@/backend/db/schema';
import { eq } from 'drizzle-orm';

export const getBusinessSurveysProcedure = publicProcedure
  .input(z.object({ businessId: z.string() }))
  .query(async ({ input }) => {
    const surveys = await db
      .select()
      .from(Survey)
      .where(eq(Survey.businessId, input.businessId));

    return surveys;
  });
