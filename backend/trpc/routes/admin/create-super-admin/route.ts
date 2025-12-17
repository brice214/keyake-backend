import { publicProcedure } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { db } from '@/backend/db';
import { SuperAdmin } from '@/backend/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const createSuperAdminProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string(),
      secretKey: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    if (input.secretKey !== 'TITAF_SUPER_ADMIN_2025') {
      throw new Error('Invalid secret key');
    }

    const existing = await db
      .select()
      .from(SuperAdmin)
      .where(eq(SuperAdmin.email, input.email))
      .limit(1);

    if (existing.length > 0) {
      throw new Error('Super admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const id = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.insert(SuperAdmin).values({
      id,
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: 'super_admin',
    });

    return {
      success: true,
      message: 'Super admin created successfully',
      email: input.email,
    };
  });