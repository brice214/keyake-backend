# Script pour remplacer les imports @/ par des imports relatifs dans backend/
# ATTENTION: Ce script modifie les fichiers. Faites un commit avant de l'exécuter!

Write-Host "=== Remplacement des imports @/ par des imports relatifs ===" -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path "backend\trpc\routes" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Calculer le chemin relatif depuis le fichier vers backend/
    $relativePath = $file.DirectoryName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    $depth = ($relativePath -split "/").Count - 1  # Nombre de niveaux à remonter
    
    $dots = "../" * ($depth + 2)  # +2 car on doit remonter jusqu'à backend/
    
    # Remplacer @/backend/ par le chemin relatif
    $content = $content -replace '@/backend/', $dots
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Modifié: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Terminé!" -ForegroundColor Green

