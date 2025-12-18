import { publicProcedure } from '../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/index.js';
import { Business } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Sur Vercel, on utilise uniquement process.env
// expo-constants n'est disponible que dans l'app mobile
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const loginBusinessProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const [business] = await db
      .select()
      .from(Business)
      .where(eq(Business.email, input.email))
      .limit(1);

    if (!business) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, business.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { businessId: business.id, email: business.email, type: 'business' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...businessWithoutPassword } = business;
    return { business: businessWithoutPassword, token };
  });
