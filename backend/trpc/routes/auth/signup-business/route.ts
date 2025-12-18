import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../../db/index.js';
import { Business } from '../../../../db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const signupBusinessProcedure = publicProcedure
  .input(
    z.object({
      companyName: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional(),
      taxId: z.string(),
      industry: z.string().optional(),
      website: z.string().optional(),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const existing = await db
      .select()
      .from(Business)
      .where(eq(Business.email, input.email))
      .limit(1);

    if (existing.length > 0) {
      throw new Error('Business with this email already exists');
    }

    const id = `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const [business] = await db
      .insert(Business)
      .values({
        id,
        companyName: input.companyName,
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        taxId: input.taxId,
        industry: input.industry,
        website: input.website,
        description: input.description,
        surveysCreated: 0,
        totalResponses: 0,
        credits: 100,
        isPremium: false,
        joinedAt: new Date(),
      })
      .returning();

    const { password: _, ...businessWithoutPassword } = business;
    return businessWithoutPassword;
  });
