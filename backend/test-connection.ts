import { db } from './db';
import { User, Business, Survey, SuperAdmin } from './db/schema';

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Test de connexion à Supabase...');
    
    const users = await db.select().from(User);
    console.log('✅ Connexion User réussie');
    
    const businesses = await db.select().from(Business);
    console.log('✅ Connexion Business réussie');
    
    const surveys = await db.select().from(Survey);
    console.log('✅ Connexion Survey réussie');
    
    const admins = await db.select().from(SuperAdmin);
    console.log('✅ Connexion SuperAdmin réussie');
    
    console.log('\n✨ Toutes les connexions sont opérationnelles !');
    
    return {
      success: true,
      tables: {
        users: users.length,
        businesses: businesses.length,
        surveys: surveys.length,
        admins: admins.length,
      }
    };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
