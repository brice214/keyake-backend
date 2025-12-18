import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../db/index.js';
import { SuperAdmin } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Sur Vercel, on utilise uniquement process.env
// expo-constants n'est disponible que dans l'app mobile
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const loginSuperAdminProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const [superAdmin] = await db
      .select()
      .from(SuperAdmin)
      .where(eq(SuperAdmin.email, input.email))
      .limit(1);

    if (!superAdmin) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, superAdmin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { adminId: superAdmin.id, email: superAdmin.email, type: 'admin' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...adminWithoutPassword } = superAdmin;
    return { admin: adminWithoutPassword, token };
  });
