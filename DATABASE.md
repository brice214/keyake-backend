# Configuration de la base de données Supabase

## Connexion
La base de données est configurée pour se connecter à Supabase PostgreSQL.

**Project:** Keyake  
**Project URL:** https://hqefowxjfvbekvnktsoh.supabase.co

Connection string: `postgresql://postgres:$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require`

## Variables d'environnement

- `DATABASE_URL`: Connection string PostgreSQL
- `SUPABASE_URL`: https://hqefowxjfvbekvnktsoh.supabase.co
- `SUPABASE_ANON_KEY`: Clé publique Supabase (dans le fichier `env`)

## Commandes Drizzle

### Push du schéma vers Supabase
Pour synchroniser le schéma Drizzle avec la base de données Supabase :
```bash
bunx drizzle-kit push
```

### Ouvrir Drizzle Studio
Pour explorer la base de données avec une interface graphique :
```bash
bunx drizzle-kit studio
```

### Générer des migrations
Pour créer des fichiers de migration :
```bash
bunx drizzle-kit generate
```

## Structure du schéma

Le schéma est défini dans `backend/db/schema.ts` et inclut les tables suivantes :
- User
- Business
- SuperAdmin
- Survey
- Question
- Answer
- CompleteSurvey
- SurveyResult
- SurveyTargeting
- Badges
- PaymentTransaction
- AdminActivity

## État actuel

✅ Dépendances installées
✅ Schéma Drizzle créé
✅ Connexion configurée
✅ Routes backend migrées
⏳ **À faire : Exécuter `bunx drizzle-kit push` pour synchroniser le schéma avec Supabase**
⏳ Tester la connexion

## Note importante

Avant la première utilisation, vous devez exécuter :
```bash
bunx drizzle-kit push
```

Cette commande va créer toutes les tables dans votre base de données Supabase selon le schéma défini.

## Migration depuis Neon

✅ Base de données migrée vers Supabase
✅ Driver changé de `@neondatabase/serverless` vers `postgres`
✅ Configuration mise à jour dans `backend/db/index.ts`
