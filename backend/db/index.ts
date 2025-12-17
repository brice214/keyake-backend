import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Sur Vercel, on utilise uniquement process.env
// expo-constants n'est disponible que dans l'app mobile
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables. Please configure it in Vercel.');
}

// Pour Supabase, on utilise postgres-js qui fonctionne avec les connection strings standard
const client = postgres(connectionString, {
  max: 1, // Limiter les connexions pour éviter les problèmes
  ssl: 'require', // Supabase nécessite SSL
});

export const db = drizzle(client, { schema });
