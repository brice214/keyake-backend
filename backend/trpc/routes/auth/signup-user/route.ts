import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../../db/index.js';
import { User } from '../../../../db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const signupUserProcedure = publicProcedure
  .input(
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional(),
      status: z.enum(['Étudiant', 'Salarié', 'Entrepreneur', 'Autre']).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const existing = await db
      .select()
      .from(User)
      .where(eq(User.email, input.email))
      .limit(1);

    if (existing.length > 0) {
      throw new Error('User with this email already exists');
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const [user] = await db
      .insert(User)
      .values({
        id,
        name: input.name,
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        status: input.status,
        surveysCompleted: 0,
        points: 0,
        joinedAt: new Date(),
      })
      .returning();

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
