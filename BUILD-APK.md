# Guide de génération de l'APK Android

## ⚠️ IMPORTANT : Exécutez ces commandes depuis le répertoire du projet

Vous devez être dans le dossier `C:\MOBILES-PROJECTS\KEYAKE` avant d'exécuter les commandes.

## Méthode automatique (recommandée)

1. Ouvrez PowerShell et naviguez vers le projet :
```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
```

2. Exécutez le script :
```powershell
.\build-apk.ps1
```

## Méthode manuelle

### Étape 1 : Aller dans le répertoire du projet

```powershell
cd C:\MOBILES-PROJECTS\KEYAKE
```

### Étape 2 : Initialiser le projet EAS (une seule fois)

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli init
```

Quand on vous demande "Would you like to automatically create an EAS project?", répondez **y** (oui).

### Étape 3 : Construire l'APK

```powershell
$env:EAS_NO_VCS = "1"
npx eas-cli build --platform android --profile preview
```

**Important :** Lors de la première construction, EAS vous demandera :
- "Generate a new Android Keystore?" → Répondez **yes** (ou **y**)

EAS générera automatiquement une clé de signature sécurisée pour signer votre APK. Cette clé sera stockée de manière sécurisée sur les serveurs Expo.

## Configuration

Le fichier `eas.json` est déjà configuré pour générer un APK avec le profil "preview".

- **Profil preview** : Génère un APK pour les tests internes
- **Profil production** : Génère un APK pour la production (utilisez `--profile production`)

## Téléchargement

Après la construction, vous recevrez un lien pour télécharger l'APK. La construction se fait sur les serveurs Expo (cloud build).

## Note

- La construction cloud est gratuite pour les comptes Expo
- Le processus peut prendre 10-20 minutes
- Vous recevrez une notification par email quand l'APK est prêt

