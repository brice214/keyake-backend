# Prochaines étapes - Configuration complète

## ✅ État actuel

- ✅ Code synchronisé avec GitHub
- ✅ Code déployé sur Vercel
- ⏳ Configuration finale nécessaire

## 📋 Étapes suivantes

### 1. Configurer les variables d'environnement sur Vercel

Le backend sur Vercel a besoin de ces variables pour fonctionner :

1. Allez sur https://vercel.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez ces variables :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://postgres:$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` (ou une clé plus sécurisée) |

**Important :** 
- Sélectionnez **Production**, **Preview**, et **Development** pour chaque variable
- Pour `DATABASE_URL`, échappez le `$` ou utilisez la valeur complète avec le mot de passe encodé en URL si nécessaire

5. **Redéployez** le projet (Vercel → Deployments → ... → Redeploy)

### 2. Tester le backend Vercel

Une fois les variables configurées et le projet redéployé :

1. Testez l'endpoint racine :
   ```
   https://votre-projet.vercel.app/
   ```
   Devrait retourner : `{"status":"ok","message":"API is running"}`

2. Testez la connexion à la base de données :
   ```
   https://votre-projet.vercel.app/api/trpc/test.connection
   ```

3. Vérifiez les logs dans Vercel (Deployments → cliquer sur le dernier deployment → Logs)

### 3. Configurer l'application mobile

Une fois que le backend fonctionne sur Vercel, vous devez configurer l'application mobile pour utiliser cette URL.

#### 3.1. Mettre à jour `app.json`

Ouvrez `app.json` et ajoutez l'URL de votre backend Vercel :

```json
{
  "expo": {
    "extra": {
      "API_BASE_URL": "https://votre-projet.vercel.app"
    }
  }
}
```

#### 3.2. Mettre à jour les secrets EAS

Dans votre terminal PowerShell :

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
$env:EAS_NO_VCS = "1"

# Remplacez par votre URL Vercel
$apiUrl = "https://votre-projet.vercel.app"

# Pour preview
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment preview --visibility plain --force --non-interactive

# Pour production
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment production --visibility plain --force --non-interactive
```

### 4. Reconstruire l'APK

Une fois la configuration mise à jour :

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
$env:EAS_NO_VCS = "1"
npx eas-cli build --platform android --profile preview
```

### 5. Tester l'application

1. **Installez l'APK** sur votre téléphone
2. **Testez la création de compte** - cela devrait maintenant fonctionner !
3. **Testez la connexion** - cela devrait maintenant fonctionner !
4. **Testez les sondages** - ils devraient se charger depuis la base de données

### 6. Créer le Super Admin (optionnel)

Vous pouvez créer le Super Admin directement dans la base de données avec le script :

```powershell
node create-admin-local.js
```

Ou via l'application une fois que le backend fonctionne.

## 🔍 Vérification finale

Vérifiez que tout fonctionne :

- [ ] Le backend répond sur Vercel
- [ ] La connexion à la base de données fonctionne
- [ ] Les variables d'environnement sont configurées dans Vercel
- [ ] L'URL du backend est configurée dans `app.json`
- [ ] Les secrets EAS sont mis à jour
- [ ] L'APK est reconstruit avec la nouvelle configuration
- [ ] L'application peut créer des comptes
- [ ] L'application peut se connecter
- [ ] Les sondages se chargent depuis la base de données

## 🐛 En cas de problème

### Le backend ne répond pas

- Vérifiez les logs dans Vercel
- Vérifiez que les variables d'environnement sont correctement configurées
- Vérifiez que le projet a été redéployé après avoir ajouté les variables

### "Network Request Failed" dans l'app

- Vérifiez que l'URL dans `app.json` est correcte
- Vérifiez que les secrets EAS sont bien configurés
- Vérifiez que l'APK a été reconstruit après la mise à jour de la configuration
- Vérifiez que le backend Vercel fonctionne (testez dans un navigateur)

### Erreur de connexion à la base de données

- Vérifiez que `DATABASE_URL` est correct dans Vercel
- Vérifiez que Supabase autorise les connexions depuis Vercel
- Vérifiez les logs Vercel pour plus de détails

## 📝 Résumé rapide

1. **Configurer DATABASE_URL et JWT_SECRET sur Vercel**
2. **Redéployer le projet Vercel**
3. **Tester le backend** (vérifier que l'API répond)
4. **Mettre à jour `app.json`** avec l'URL Vercel
5. **Mettre à jour les secrets EAS** avec l'URL Vercel
6. **Reconstruire l'APK**
7. **Tester l'application complète**

Une fois ces étapes terminées, votre application devrait être entièrement fonctionnelle ! 🎉

