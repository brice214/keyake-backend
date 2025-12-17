import { publicProcedure } from '@/backend/trpc/create-context';
import { db } from '@/backend/db';
import { Business, User, Survey } from '@/backend/db/schema';
import { count } from 'drizzle-orm';

export const getAdminStatsProcedure = publicProcedure.query(async () => {
  const [businessesCount] = await db.select({ count: count() }).from(Business);
  const [participantsCount] = await db.select({ count: count() }).from(User);
  const [surveysCount] = await db.select({ count: count() }).from(Survey);

  return {
    totalBusinesses: businessesCount.count,
    totalParticipants: participantsCount.count,
    totalSurveys: surveysCount.count,
    totalRevenue: 0,
    activeBusinesses: businessesCount.count,
    activeSurveys: surveysCount.count,
  };
});
