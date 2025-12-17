# Debug du crash Vercel

## 🔍 Erreur : "This Serverless Function has crashed"

Cela indique généralement :
1. Erreur dans le code du backend
2. Problème de connexion à la base de données
3. Module manquant ou import incorrect
4. Variable d'environnement manquante

## 📋 Étapes de debug

### 1. Vérifier les logs Vercel

1. Allez sur https://vercel.com
2. Sélectionnez votre projet `keyake-backend`
3. Allez dans **Deployments**
4. Cliquez sur le dernier déploiement
5. Regardez les **Logs** ou **Functions** → cliquez sur `/api/index.ts` → **Logs**

Les logs vous diront exactement quelle erreur s'est produite.

### 2. Vérifier les variables d'environnement

Dans Vercel → Settings → Environment Variables, vérifiez que :
- ✅ `DATABASE_URL` est bien configurée
- ✅ `JWT_SECRET` est bien configurée
- ✅ Les deux sont disponibles pour **Production**, **Preview**, et **Development**

### 3. Problèmes courants

#### Problème : Erreur de connexion à la base de données

Si les logs montrent "DATABASE_URL is not defined" ou une erreur de connexion :
- Vérifiez que `DATABASE_URL` est bien dans les variables d'environnement
- Vérifiez que la connection string est correcte
- Vérifiez que Supabase autorise les connexions depuis Vercel

#### Problème : Module non trouvé

Si les logs montrent "Cannot find module" :
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez que `node_modules` n'est pas dans `.vercelignore`

#### Problème : Erreur dans le code

Si les logs montrent une erreur TypeScript ou runtime :
- Vérifiez que `api/index.ts` exporte correctement l'app
- Vérifiez que les imports sont corrects

## 🔧 Solution temporaire : Ajouter un handler d'erreur

Ajoutez un handler d'erreur dans `api/index.ts` pour voir l'erreur exacte :

```typescript
// Dans api/index.ts, ajoutez avant export default app :
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: err.message, stack: err.stack }, 500);
});
```

## 📝 Partager les logs

Copiez les logs d'erreur de Vercel et partagez-les pour que je puisse vous aider à identifier le problème exact.

