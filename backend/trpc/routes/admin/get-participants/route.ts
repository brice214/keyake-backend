import { publicProcedure } from '../../../create-context.js';
import { db } from '../../../../db/index.js';
import { User } from '../../../../db/schema.js';

export const getAllParticipantsProcedure = publicProcedure.query(async () => {
  const participants = await db.select().from(User);
  return participants;
});
