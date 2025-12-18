import { publicProcedure } from '../../../create-context.js';
import { db } from '../../../../db/index.js';
import { Business, User, Survey } from '../../../../db/schema.js';
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
