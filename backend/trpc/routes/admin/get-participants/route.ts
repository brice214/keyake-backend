import { publicProcedure } from '@/backend/trpc/create-context';
import { db } from '@/backend/db';
import { User } from '@/backend/db/schema';

export const getAllParticipantsProcedure = publicProcedure.query(async () => {
  const participants = await db.select().from(User);
  return participants;
});
