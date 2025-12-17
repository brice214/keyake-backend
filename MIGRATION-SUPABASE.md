# Migration de Neon vers Supabase

## ✅ Modifications effectuées

### 1. Configuration de la base de données

**Fichier modifié : `backend/db/index.ts`**
- ❌ Ancien driver : `@neondatabase/serverless` avec `drizzle-orm/neon-http`
- ✅ Nouveau driver : `postgres` avec `drizzle-orm/postgres-js`
- ✅ Configuration SSL ajoutée pour Supabase
- ✅ Limite de connexions configurée

### 2. Variables d'environnement

**Fichier modifié : `env`**
- ✅ `DATABASE_URL` mise à jour avec la connection string Supabase
- ✅ Ajout de `SUPABASE_URL`
- ✅ Ajout de `SUPABASE_ANON_KEY`

**Connection String Supabase :**
```
postgresql://postgres:$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require
```

**Informations du projet :**
- Project: Keyake
- Project URL: https://hqefowxjfvbekvnktsoh.supabase.co
- Database: postgres (port 5432)

### 3. Dépendances

**Package installé :**
- ✅ `postgres@3.4.7` - Driver PostgreSQL pour Supabase

**Note :** Le package `@neondatabase/serverless` est toujours dans les dépendances mais n'est plus utilisé. Vous pouvez le retirer si vous voulez nettoyer les dépendances.

### 4. Documentation mise à jour

- ✅ `DATABASE.md` - Mis à jour avec les informations Supabase
- ✅ `backend/test-connection.ts` - Messages mis à jour
- ✅ `app/test-connection.tsx` - Interface utilisateur mise à jour

## 📋 Prochaines étapes

### 1. Synchroniser le schéma avec Supabase

Avant d'utiliser la base de données, vous devez créer les tables dans Supabase :

```bash
# Depuis le répertoire du projet
npx drizzle-kit push
```

Cette commande va créer toutes les tables définies dans `backend/db/schema.ts` dans votre base de données Supabase.

### 2. Vérifier la connexion

Vous pouvez tester la connexion via :
- L'interface de test dans l'app : `/test-connection`
- Ou directement via Drizzle Studio : `npx drizzle-kit studio`

### 3. Configuration Supabase (optionnel)

Si vous voulez utiliser les fonctionnalités Supabase (auth, storage, etc.) au-delà de PostgreSQL :

1. Installez le client Supabase :
```bash
npm install @supabase/supabase-js
```

2. Utilisez les variables d'environnement déjà configurées :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## 🔒 Sécurité

**Important :** 
- Le fichier `env` contient des informations sensibles (mot de passe, clés API)
- Ne commitez jamais ce fichier dans Git
- Utilisez les variables d'environnement dans votre système de déploiement

Pour EAS Build, configurez les secrets :
```bash
$env:EAS_NO_VCS = "1"
npx eas-cli secret:create --scope project --name DATABASE_URL --value "postgresql://postgres:VOTRE_MOT_DE_PASSE@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require"
```

## ⚠️ Notes importantes

1. **Caractères spéciaux dans le mot de passe** : Le mot de passe contient des caractères spéciaux (`$`, `!`, `-`). Dans certaines situations, vous devrez peut-être encoder ces caractères dans l'URL.

2. **SSL requis** : Supabase nécessite SSL, c'est pourquoi `sslmode=require` est dans la connection string.

3. **Pool de connexions** : La configuration limite les connexions à 1 pour éviter les problèmes. Ajustez selon vos besoins.

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. ✅ Le code compile sans erreurs (`npx tsc --noEmit`)
2. ⏳ Le schéma est synchronisé avec Supabase (`npx drizzle-kit push`)
3. ⏳ La connexion fonctionne (test via l'app ou Drizzle Studio)

