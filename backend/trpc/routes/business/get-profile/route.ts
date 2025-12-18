import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../../db/index.js';
import { Business } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export const getBusinessProfileProcedure = publicProcedure
  .input(z.object({ businessId: z.string() }))
  .query(async ({ input }) => {
    const [business] = await db
      .select()
      .from(Business)
      .where(eq(Business.id, input.businessId))
      .limit(1);

    if (!business) {
      throw new Error('Business not found');
    }

    return business;
  });
