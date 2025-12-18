import { publicProcedure } from '../../../create-context.js';
import { testDatabaseConnection } from '../../../test-connection.js';

export const testConnectionProcedure = publicProcedure.query(async () => {
  const result = await testDatabaseConnection();
  
  if (!result.success) {
    throw new Error(`Database connection failed: ${result.error}`);
  }
  
  return result;
});
