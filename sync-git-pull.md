# Solution : Le repository distant contient des changements

## 🔍 Problème

Le repository GitHub contient des commits que votre code local n'a pas. Vous devez fusionner ces changements avant de pousser.

## ✅ Solution recommandée : Pull puis Push

### Option 1 : Fusion normale (merge)

```powershell
# 1. Récupérer et fusionner les changements distants
git pull origin main --no-rebase

# 2. Résoudre les conflits s'il y en a (si Git vous le demande)
# 3. Pousser vos changements
git push -u origin main
```

### Option 2 : Rebase (garder un historique linéaire)

```powershell
# 1. Récupérer et rebaser vos commits par-dessus les changements distants
git pull origin main --rebase

# 2. Résoudre les conflits s'il y en a (si Git vous le demande)
# 3. Pousser vos changements
git push -u origin main
```

## ⚠️ Option 3 : Forcer le push (ATTENTION - Écrase le remote)

**⚠️ UTILISEZ CETTE OPTION SEULEMENT SI :**
- Vous êtes sûr que vous voulez écraser tout ce qui est sur GitHub
- Personne d'autre ne travaille sur ce repository
- Vous avez fait une sauvegarde

```powershell
# ATTENTION : Cela écrase tout ce qui est sur GitHub
git push -u origin main --force
```

## 📋 Commande recommandée (Option 1 - Fusion)

Exécutez ces commandes dans l'ordre :

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE

# Récupérer et fusionner
git pull origin main --no-rebase

# Si Git demande un message de commit pour la fusion, gardez celui par défaut
# (tapez juste Enter)

# Pousser vos changements
git push -u origin main
```

## 🔧 Si vous avez des conflits

Si Git vous dit qu'il y a des conflits :

1. Ouvrez les fichiers en conflit
2. Recherchez les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`
3. Résolvez les conflits en gardant le bon code
4. Ajoutez les fichiers résolus : `git add .`
5. Finalisez la fusion : `git commit`
6. Poussez : `git push -u origin main`

