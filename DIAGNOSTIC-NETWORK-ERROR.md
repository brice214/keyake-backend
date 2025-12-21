# Diagnostic : "Network request failed"

L'erreur **"Network request failed"** peut provenir de **3 sources différentes** :

## 🔍 Sources possibles

### 1. **Vercel (Endpoint API non accessible)** ⚠️ PROBABLE

**Problème** : L'endpoint `/api/trpc` ne répond pas correctement sur Vercel.

**Symptômes** :
- 404 Not Found sur `https://keyake-backend.vercel.app/api/trpc/test.connection`
- L'endpoint n'est pas détecté par Vercel
- Les logs Vercel montrent des 404

**Vérification** :
1. Testez dans le navigateur : `https://keyake-backend.vercel.app/api/trpc/test.connection`
2. Consultez les logs Vercel dans le dashboard
3. Vérifiez que `api/index.ts` est correctement exporté

**Configuration actuelle** :
- Client tRPC pointe vers : `https://keyake-backend.vercel.app/api/trpc`
- Fichier API : `api/index.ts` (utilise `hono/vercel`)
- Route Hono : `/trpc/*` avec `endpoint: "/api/trpc"`

**Solution potentielle** :
Le problème peut venir de la configuration des routes dans `backend/hono.ts`. Il y a un conflit entre :
- La route Hono : `/trpc/*`
- L'endpoint tRPC : `/api/trpc`

### 2. **Supabase (Base de données non accessible)** ⚠️ PROBABLE

**Problème** : La variable `DATABASE_URL` n'est pas configurée dans Vercel, ou Supabase n'est pas accessible.

**Symptômes** :
- L'API répond mais retourne une erreur 500
- Les endpoints qui utilisent la DB plantent
- Erreur dans les logs : "DATABASE_URL is not defined"

**Vérification** :
1. Allez dans Vercel Dashboard → Settings → Environment Variables
2. Vérifiez que `DATABASE_URL` est configurée :
   ```
   DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require
   ```
3. Vérifiez que `JWT_SECRET` est également configurée

**Code concerné** :
```typescript
// backend/db/index.ts
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined...');
}
```

**Solution** :
Configurer les variables d'environnement dans Vercel Dashboard.

### 3. **Code (Configuration incorrecte)** ⚠️ MOINS PROBABLE

**Problème** : L'URL ou la configuration du client tRPC est incorrecte.

**Vérification** :
- Fichier : `lib/trpc.ts`
- URL configurée : `https://keyake-backend.vercel.app/api/trpc`
- Vérifiez que cette URL est correcte

**Solution** :
Si l'URL est incorrecte, modifiez-la dans `lib/trpc.ts`.

---

## 🔧 Comment diagnostiquer

### Étape 1 : Tester l'endpoint directement

Testez dans le navigateur ou avec curl :
```bash
# Test de base
curl https://keyake-backend.vercel.app/api/trpc/test.connection

# Test avec méthode POST (requis pour tRPC)
curl -X POST https://keyake-backend.vercel.app/api/trpc/test.connection \
  -H "Content-Type: application/json"
```

### Étape 2 : Vérifier les logs Vercel

1. Allez dans Vercel Dashboard
2. Ouvrez votre projet
3. Allez dans l'onglet "Functions" ou "Logs"
4. Regardez les erreurs lors d'une requête

### Étape 3 : Vérifier les variables d'environnement

1. Vercel Dashboard → Settings → Environment Variables
2. Vérifiez :
   - ✅ `DATABASE_URL` est définie
   - ✅ `JWT_SECRET` est définie
   - ✅ Les valeurs sont correctes (sans espaces, caractères spéciaux encodés)

### Étape 4 : Tester la connexion Supabase

Si `DATABASE_URL` est configurée, testez la connexion depuis votre machine locale :
```bash
# Depuis le projet
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

---

## 📊 Probabilité selon les symptômes

| Symptôme | Source probable | Action |
|----------|----------------|--------|
| 404 Not Found | **Vercel** | Vérifier le routing dans `backend/hono.ts` |
| 500 Internal Server Error | **Supabase** | Vérifier `DATABASE_URL` dans Vercel |
| Timeout | **Vercel** ou **Supabase** | Vérifier les deux |
| CORS Error | **Vercel** | Ajouter CORS dans `backend/hono.ts` |
| "Network request failed" générique | **Les 3** | Suivre le diagnostic étape par étape |

---

## 🎯 Action immédiate recommandée

**Vérifiez d'abord Vercel** :

1. ✅ Vérifiez que `DATABASE_URL` et `JWT_SECRET` sont dans Vercel Dashboard
2. ✅ Testez l'endpoint directement : `https://keyake-backend.vercel.app/api/trpc/test.connection`
3. ✅ Consultez les logs Vercel pour voir les erreurs exactes

Ensuite, si nécessaire, corrigez la configuration des routes dans `backend/hono.ts`.

