# Script pour corriger le remote Git
cd C:\MOBILES-PROJECTS\KEYAKE

Write-Host "=== Correction du remote Git ===" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier le remote actuel
Write-Host "1. Remote actuel:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# 2. Supprimer l'ancien remote
Write-Host "2. Suppression de l'ancien remote..." -ForegroundColor Yellow
git remote remove origin

# 3. Ajouter le bon remote
Write-Host "3. Ajout du nouveau remote..." -ForegroundColor Yellow
$repoUrl = "https://github.com/brice214/rork-keyake.git"
git remote add origin $repoUrl

# 4. Vérifier le nouveau remote
Write-Host "4. Nouveau remote:" -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "✅ Remote configuré!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour pousser maintenant, exécutez:" -ForegroundColor Cyan
Write-Host "  git push -u origin main" -ForegroundColor White

