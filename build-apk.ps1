# Script pour générer l'APK Android
# Exécutez ce script dans PowerShell : .\build-apk.ps1

$env:EAS_NO_VCS = "1"

Write-Host "=== Génération de l'APK Android ===" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Initialiser le projet EAS (si pas déjà fait)
Write-Host "Étape 1: Vérification de la configuration EAS..." -ForegroundColor Yellow
$projectIdExists = Select-String -Path "app.json" -Pattern '"projectId"' -Quiet

if (-not $projectIdExists) {
    Write-Host "Le projet EAS n'est pas encore configuré." -ForegroundColor Yellow
    Write-Host "Initialisation du projet EAS..." -ForegroundColor Yellow
    npx eas-cli init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erreur lors de l'initialisation. Veuillez exécuter manuellement: npx eas-cli init" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Le projet EAS est déjà configuré." -ForegroundColor Green
}

Write-Host ""
Write-Host "Étape 2: Construction de l'APK..." -ForegroundColor Yellow
npx eas-cli build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== APK généré avec succès! ===" -ForegroundColor Green
    Write-Host "Téléchargez l'APK depuis le lien fourni ci-dessus." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=== Erreur lors de la génération de l'APK ===" -ForegroundColor Red
    exit 1
}

