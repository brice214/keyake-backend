import { publicProcedure } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { db } from '@/backend/db';
import { PaymentTransaction, Business } from '@/backend/db/schema';
import { eq } from 'drizzle-orm';

export const addCreditsProcedure = publicProcedure
  .input(
    z.object({
      businessId: z.string(),
      amount: z.number(),
      credits: z.number(),
      method: z.enum(['airtel', 'mobicash', 'card']),
    })
  )
  .mutation(async ({ input }) => {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.insert(PaymentTransaction).values({
      id: transactionId,
      businessId: input.businessId,
      amount: input.amount,
      credits: input.credits,
      method: input.method,
      status: 'completed',
      createdAt: new Date(),
      completedAt: new Date(),
    });

    const [business] = await db
      .select()
      .from(Business)
      .where(eq(Business.id, input.businessId));

    if (business) {
      await db
        .update(Business)
        .set({
          credits: business.credits + input.credits,
        })
        .where(eq(Business.id, input.businessId));
    }

    return { success: true, transactionId };
  });
