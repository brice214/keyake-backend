import { publicProcedure } from '@/backend/trpc/create-context';
import { db } from '@/backend/db';
import { Business } from '@/backend/db/schema';

export const getAllBusinessesProcedure = publicProcedure.query(async () => {
  const businesses = await db.select().from(Business);
  return businesses;
});
