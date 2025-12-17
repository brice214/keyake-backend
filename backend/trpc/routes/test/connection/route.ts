import { publicProcedure } from '@/backend/trpc/create-context';
import { testDatabaseConnection } from '@/backend/test-connection';

export const testConnectionProcedure = publicProcedure.query(async () => {
  const result = await testDatabaseConnection();
  
  if (!result.success) {
    throw new Error(`Database connection failed: ${result.error}`);
  }
  
  return result;
});
