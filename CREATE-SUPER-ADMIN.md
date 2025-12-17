# Créer le Super Admin directement dans la base de données

## Problème

L'erreur "Network Request Failed" se produit car le backend n'est pas déployé. L'application mobile ne peut pas accéder à `localhost:3000`.

## Solution temporaire : Créer le Super Admin directement

Vous pouvez créer le Super Admin directement dans la base de données Supabase en utilisant le script fourni :

### Méthode 1 : Via le script Node.js (Modifié pour Supabase)

1. **Créer un script adapté pour Supabase** :

Le script existant utilise Neon. Vous devez le modifier pour utiliser Supabase ou utiliser directement Drizzle.

### Méthode 2 : Via Supabase Dashboard (Plus simple)

1. Allez sur https://supabase.com/dashboard/project/hqefowxjfvbekvnktsoh/editor
2. Ouvrez l'éditeur SQL
3. Exécutez cette requête SQL :

```sql
-- Hasher le mot de passe : Mambelo2025 (vous devrez le hasher avec bcrypt)
-- Ou utilisez le script ci-dessous pour générer le hash

-- Remplacez 'HASHED_PASSWORD' par le hash généré par le script
INSERT INTO "SuperAdmin" (id, email, password, name, role, created_at)
VALUES (
  'admin_' || EXTRACT(EPOCH FROM NOW())::text || '_' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 9),
  'admin@titafgroupe.com',
  '$2a$10$VOTRE_HASH_ICI', -- Remplacez par le hash bcrypt du mot de passe
  'Super Admin',
  'super_admin',
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET password = EXCLUDED.password;
```

**Note** : Vous devrez générer le hash bcrypt du mot de passe "Mambelo2025" d'abord.

### Méthode 3 : Utiliser Node.js localement

Créez un fichier temporaire pour générer le hash et insérer dans Supabase :

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Mambelo2025', 10).then(hash => console.log(hash));"
```

Ensuite, utilisez ce hash dans la requête SQL ci-dessus.

## Solution permanente : Déployer le backend

Pour que l'application fonctionne complètement, vous devez déployer le backend sur un service comme :
- Vercel (recommandé pour Hono)
- Railway
- Fly.io
- Render

Une fois déployé, configurez l'URL dans `app.json` :

```json
{
  "expo": {
    "extra": {
      "API_BASE_URL": "https://votre-backend.vercel.app"
    }
  }
}
```

