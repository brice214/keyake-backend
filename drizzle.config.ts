import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Charger les variables d'environnement depuis le fichier 'env' ou '.env'
try {
  // Essayer de charger depuis .env d'abord
  config({ path: '.env' });
} catch {
  // Si .env n'existe pas, charger depuis 'env'
  try {
    const envContent = readFileSync(join(process.cwd(), 'env'), 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    });
  } catch (error) {
    // Fichier env non trouvé, continuer avec les variables d'environnement système
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables. Make sure the "env" file exists in the project root.');
}

export default defineConfig({
  out: './drizzle',
  schema: './backend/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
