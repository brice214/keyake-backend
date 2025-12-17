# Guide de déploiement du backend sur Vercel

## Prérequis

- Compte Vercel (gratuit) : https://vercel.com
- Compte GitHub (pour connecter le repo)
- Backend Hono configuré avec Supabase

## Étapes de déploiement

### 1. Créer le fichier de configuration Vercel

Créez un fichier `api/index.ts` à la racine du projet :

```typescript
// api/index.ts
import app from '../backend/hono';

export default app;
```

Ou créez un fichier `vercel.json` :

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    }
  ],
  "functions": {
    "api/index.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### 2. Installer les dépendances nécessaires

Le backend utilise déjà les dépendances nécessaires.

### 3. Configurer les variables d'environnement sur Vercel

Dans le dashboard Vercel :
1. Allez dans votre projet
2. Settings → Environment Variables
3. Ajoutez :
   - `DATABASE_URL` : votre connection string Supabase
   - `JWT_SECRET` : votre clé secrète JWT

### 4. Déployer

1. Connectez votre repo GitHub à Vercel
2. Vercel détectera automatiquement le projet
3. Configurez le "Root Directory" si nécessaire
4. Cliquez sur "Deploy"

### 5. Configurer l'URL dans l'application

Une fois déployé, vous obtiendrez une URL comme : `https://votre-projet.vercel.app`

Mettez à jour `app.json` :

```json
{
  "expo": {
    "extra": {
      "API_BASE_URL": "https://votre-projet.vercel.app"
    }
  }
}
```

Et mettez à jour les secrets EAS :

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "https://votre-projet.vercel.app" --type string --environment preview --visibility plain --force --non-interactive
```

### 6. Reconstruire l'APK

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli build --platform android --profile preview
```

## Alternative : Déploiement manuel avec un fichier serveur

Si Vercel ne fonctionne pas directement, vous pouvez créer un fichier serveur :

```typescript
// server.ts
import app from './backend/hono';

const port = process.env.PORT || 3000;

export default {
  port,
  fetch: app.fetch,
};
```

Puis déployer sur Railway ou Fly.io avec ce serveur.

## Note importante

Le backend doit être accessible publiquement avec CORS configuré (déjà fait dans `backend/hono.ts` avec `cors()`).

