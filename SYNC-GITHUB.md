# Guide de synchronisation avec GitHub

## 📋 Situation

Votre code local (sur votre PC) n'est pas synchronisé avec GitHub. Pour déployer sur Vercel, vous devez pousser votre code sur GitHub.

## 🔧 Étape 1 : Installer Git

### Windows

1. **Téléchargez Git** : https://git-scm.com/download/win
2. **Installez** en suivant les instructions (gardez les options par défaut)
3. **Redémarrez votre terminal** après l'installation

### Vérifier l'installation

Ouvrez un nouveau terminal PowerShell et exécutez :
```powershell
git --version
```

Vous devriez voir quelque chose comme : `git version 2.x.x`

## 🔧 Étape 2 : Configurer Git (une seule fois)

```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

## 🔧 Étape 3 : Vérifier si le projet est déjà un repo Git

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
git status
```

### Si Git dit "not a git repository" :

Votre projet n'est pas encore un repository Git. Passez à l'étape 4.

### Si Git affiche des fichiers :

Votre projet est déjà un repository Git. Passez à l'étape 5.

## 🔧 Étape 4 : Initialiser Git (si pas déjà fait)

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
git init
```

## 🔧 Étape 5 : Ajouter tous les fichiers

```powershell
git add .
```

**Note :** Les fichiers dans `.gitignore` seront automatiquement exclus (node_modules, .env, etc.)

## 🔧 Étape 6 : Créer un commit

```powershell
git commit -m "Ajout des fichiers de configuration pour Vercel et Supabase"
```

## 🔧 Étape 7 : Connecter à GitHub

### Option A : Créer un nouveau repository sur GitHub

1. Allez sur https://github.com
2. Cliquez sur "New repository"
3. Nommez-le (ex: `keyake`)
4. **Ne cochez PAS** "Initialize with README"
5. Cliquez sur "Create repository"

### Option B : Utiliser un repository existant

Si vous avez déjà un repository GitHub pour ce projet, utilisez son URL.

## 🔧 Étape 8 : Ajouter le remote GitHub

Remplacer `VOTRE_USERNAME` et `NOM_REPO` par vos informations :

```powershell
git remote add origin https://github.com/VOTRE_USERNAME/NOM_REPO.git
```

Pour vérifier :
```powershell
git remote -v
```

## 🔧 Étape 9 : Pousser vers GitHub

```powershell
git branch -M main
git push -u origin main
```

Vous serez invité à entrer vos identifiants GitHub.

## ✅ Vérification

Allez sur votre repository GitHub et vérifiez que tous les fichiers sont présents, notamment :
- `api/index.ts`
- `vercel.json`
- `backend/`
- `package.json`
- etc.

## 🔄 Synchronisation future

Pour synchroniser vos changements locaux avec GitHub :

```powershell
# 1. Voir les fichiers modifiés
git status

# 2. Ajouter les fichiers modifiés
git add .

# 3. Créer un commit
git commit -m "Description de vos modifications"

# 4. Pousser vers GitHub
git push
```

## 📝 Fichiers importants à synchroniser

Assurez-vous que ces fichiers sont bien sur GitHub :
- ✅ `api/index.ts` (nouveau)
- ✅ `vercel.json` (nouveau)
- ✅ `.vercelignore` (nouveau)
- ✅ `backend/` (tout le dossier)
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `.npmrc` (nouveau)

## ❌ Fichiers à NE PAS synchroniser (déjà dans .gitignore)

Ces fichiers sont automatiquement exclus :
- `node_modules/`
- `.env`
- `dist/`
- `.expo/`
- etc.

## 🆘 En cas de problème

### Erreur : "fatal: not a git repository"
→ Exécutez `git init` d'abord

### Erreur : "remote origin already exists"
→ Vous pouvez soit :
- Supprimer l'ancien : `git remote remove origin` puis refaire `git remote add origin ...`
- Ou utiliser l'existant : `git remote set-url origin https://github.com/VOTRE_USERNAME/NOM_REPO.git`

### Erreur lors du push : authentification
→ Vous devrez vous authentifier. GitHub recommande maintenant les Personal Access Tokens au lieu des mots de passe.

## 🔐 Authentification GitHub

Si vous devez créer un Personal Access Token :

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token"
3. Donnez-lui un nom et sélectionnez les scopes : `repo`
4. Copiez le token
5. Utilisez-le comme mot de passe lors du `git push`

