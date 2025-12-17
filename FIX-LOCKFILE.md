# Résolution du problème de lockfile EAS

## Problème

Le build EAS échouait avec l'erreur :
```
error: lockfile had changes, but lockfile is frozen
```

## Cause

Le projet avait à la fois `bun.lock` et `package-lock.json`. EAS détectait `bun.lock` et essayait d'utiliser `bun install --frozen-lockfile`, mais le lockfile n'était pas synchronisé avec les dépendances (ajout de `postgres` et `dotenv` avec npm).

## Solution appliquée

1. ✅ Suppression de `bun.lock` - EAS utilisera maintenant npm automatiquement
2. ✅ `package-lock.json` mis à jour avec toutes les dépendances
3. ✅ Configuration Node.js ajoutée dans `eas.json`

## Configuration actuelle

- **Gestionnaire de paquets** : npm (détecté via `package-lock.json`)
- **Node.js version** : 22.x.x (spécifiée dans `eas.json`)
- **Lockfile** : `package-lock.json` (synchronisé)

## Prochain build

Le prochain build EAS devrait fonctionner correctement car :
- Seul `package-lock.json` existe maintenant
- EAS détectera automatiquement npm
- Le lockfile est synchronisé avec `package.json`

## Note

Si vous souhaitez utiliser Bun à l'avenir, vous devrez :
1. Installer Bun localement
2. Exécuter `bun install` pour créer/mettre à jour `bun.lock`
3. Ne pas mélanger npm et bun

