# Guide de déploiement du backend sur Vercel

## ✅ Fichiers créés

1. **`api/index.ts`** - Point d'entrée pour Vercel (exporte l'app Hono)
2. **`vercel.json`** - Configuration Vercel
3. **`.vercelignore`** - Fichiers à exclure du déploiement

## 📋 Étapes de déploiement

### 1. Préparer le projet

Les fichiers sont déjà créés. Vérifiez que :
- ✅ `api/index.ts` existe
- ✅ `vercel.json` existe
- ✅ `.vercelignore` existe

### 2. Connecter à Vercel

**Option A : Via l'interface web (Recommandé)**

1. Allez sur https://vercel.com
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Vercel détectera automatiquement la configuration

**Option B : Via la CLI**

```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configurer les variables d'environnement

Dans le dashboard Vercel, allez dans :
**Settings → Environment Variables**

Ajoutez ces variables :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://postgres:$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` |

**Important :** Pour `DATABASE_URL`, échappez le `$` dans l'interface Vercel ou utilisez la valeur complète.

### 4. Déployer

1. Cliquez sur "Deploy" dans Vercel
2. Attendez que le déploiement se termine
3. Vous obtiendrez une URL comme : `https://votre-projet.vercel.app`

### 5. Tester le backend

Une fois déployé, testez l'endpoint :
```
https://votre-projet.vercel.app/
```

Vous devriez voir : `{"status":"ok","message":"API is running"}`

### 6. Configurer l'application mobile

Une fois que vous avez l'URL du backend, mettez à jour `app.json` :

```json
{
  "expo": {
    "extra": {
      "API_BASE_URL": "https://votre-projet.vercel.app"
    }
  }
}
```

### 7. Mettre à jour les secrets EAS

```powershell
$env:EAS_NO_VCS = "1"
$apiUrl = "https://votre-projet.vercel.app"
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment preview --visibility plain --force --non-interactive
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment production --visibility plain --force --non-interactive
```

### 8. Reconstruire l'APK

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli build --platform android --profile preview
```

## 🔧 Configuration Vercel

### Build Settings

Vercel détectera automatiquement :
- **Framework Preset** : Other
- **Build Command** : (laissé vide, pas nécessaire)
- **Output Directory** : (laissé vide)
- **Install Command** : `npm install --legacy-peer-deps`

### Variables d'environnement requises

- `DATABASE_URL` : Connection string Supabase
- `JWT_SECRET` : Clé secrète pour les tokens JWT

## ✅ Vérification

Après le déploiement :

1. Testez l'endpoint racine : `https://votre-projet.vercel.app/`
2. Testez l'endpoint tRPC : `https://votre-projet.vercel.app/api/trpc/test.connection`
3. Vérifiez les logs dans le dashboard Vercel en cas d'erreur

## 🐛 Dépannage

### Erreur : "Module not found"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez que `.vercelignore` n'exclut pas des fichiers nécessaires

### Erreur : "DATABASE_URL is not defined"
- Vérifiez que la variable d'environnement est bien configurée dans Vercel
- Vérifiez qu'elle est disponible pour tous les environnements (Production, Preview, Development)

### Erreur : "Cannot connect to database"
- Vérifiez que la connection string est correcte
- Vérifiez que Supabase autorise les connexions depuis Vercel (IP whitelist si nécessaire)

## 📝 Notes importantes

- Le backend sera accessible publiquement
- Les variables d'environnement sont sécurisées dans Vercel
- Le déploiement est automatique à chaque push sur GitHub (si connecté)
- Vercel offre un plan gratuit généreux pour commencer

