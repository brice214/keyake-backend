import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/index.js';
import { Survey } from '../../../db/schema.js';
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
