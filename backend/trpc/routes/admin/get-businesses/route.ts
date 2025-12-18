import { publicProcedure } from '../../create-context.js';
import { db } from '../../../db/index.js';
import { Business } from '../../../db/schema.js';

export const getAllBusinessesProcedure = publicProcedure.query(async () => {
  const businesses = await db.select().from(Business);
  return businesses;
});
