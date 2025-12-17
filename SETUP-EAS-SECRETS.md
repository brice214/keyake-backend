# Configuration des secrets EAS pour Supabase

## Créer le secret DATABASE_URL

Utilisez la nouvelle commande `eas env:create` :

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli env:create --scope project --name DATABASE_URL --value "postgresql://postgres:`$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require" --type string
```

**Note importante** : Dans PowerShell, le caractère `$` doit être échappé avec un backtick (`` `$ ``) car c'est un caractère spécial PowerShell.

## Alternative : Utiliser des guillemets simples

Si vous avez des problèmes avec les caractères spéciaux, vous pouvez utiliser des guillemets simples :

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli env:create --scope project --name DATABASE_URL --value 'postgresql://postgres:$yKte8fxb!nH5-W@db.hqefowxjfvbekvnktsoh.supabase.co:5432/postgres?sslmode=require' --type string
```

## Créer le secret JWT_SECRET (optionnel)

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli env:create --scope project --name JWT_SECRET --value "your-super-secret-jwt-key-change-this-in-production" --type string
```

## Vérifier les secrets créés

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli env:list --scope project
```

## Utiliser les secrets dans eas.json

Les secrets sont automatiquement disponibles comme variables d'environnement pendant les builds. Vous n'avez pas besoin de les référencer explicitement dans `eas.json` si vous utilisez `process.env.DATABASE_URL` dans votre code.

Cependant, si vous voulez les rendre explicites dans la configuration :

```json
{
  "build": {
    "preview": {
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "JWT_SECRET": "${JWT_SECRET}"
      }
    }
  }
}
```

