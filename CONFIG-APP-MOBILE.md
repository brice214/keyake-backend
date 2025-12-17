# Configuration de l'application mobile

## Étape 1 : Tester le backend Vercel

Avant de configurer l'app mobile, vérifiez que le backend fonctionne :

1. **Testez l'endpoint racine** :
   ```
   https://VOTRE-URL-VERCEL.app/
   ```
   Devrait retourner : `{"status":"ok","message":"API is running"}`

2. **Testez la connexion à la base de données** :
   ```
   https://VOTRE-URL-VERCEL.app/api/trpc/test.connection
   ```

## Étape 2 : Mettre à jour app.json

Une fois que vous avez l'URL de Vercel, mettez à jour `app.json` :

```json
{
  "expo": {
    "extra": {
      "API_BASE_URL": "https://VOTRE-URL-VERCEL.app"
    }
  }
}
```

## Étape 3 : Mettre à jour les secrets EAS

Dans PowerShell :

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
$env:EAS_NO_VCS = "1"

# Remplacez par votre URL Vercel
$apiUrl = "https://VOTRE-URL-VERCEL.app"

# Pour preview
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment preview --visibility plain --force --non-interactive

# Pour production
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment production --visibility plain --force --non-interactive
```

## Étape 4 : Reconstruire l'APK

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli build --platform android --profile preview
```

## Étape 5 : Tester l'application

1. Installez l'APK sur votre téléphone
2. Testez la création de compte
3. Testez la connexion
4. Testez le chargement des sondages

