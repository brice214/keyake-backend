# Script pour configurer les secrets EAS avec l'URL Vercel
cd C:\MOBILES-PROJECTS\KEYAKE

$env:EAS_NO_VCS = "1"
$apiUrl = "https://keyake-backend.vercel.app"

Write-Host "=== Configuration des secrets EAS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL du backend: $apiUrl" -ForegroundColor Yellow
Write-Host ""

# Pour preview
Write-Host "Configuration pour preview..." -ForegroundColor Yellow
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment preview --visibility plain --force --non-interactive

# Pour production
Write-Host "Configuration pour production..." -ForegroundColor Yellow
npx eas-cli env:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value $apiUrl --type string --environment production --visibility plain --force --non-interactive

Write-Host ""
Write-Host "✅ Secrets EAS configurés!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour reconstruire l'APK, exécutez:" -ForegroundColor Cyan
Write-Host '  $env:EAS_NO_VCS = "1"' -ForegroundColor White
Write-Host '  npx eas-cli build --platform android --profile preview' -ForegroundColor White

