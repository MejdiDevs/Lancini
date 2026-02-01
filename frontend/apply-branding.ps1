$files = Get-ChildItem -Path "src\app\(dashboard)" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace green colors with orange
    $content = $content -replace '#22C55E','#EC6D0A'
    $content = $content -replace '#16A34A','#d66209'
    $content = $content -replace 'green-50','orange-50'
    $content = $content -replace 'green-100','orange-100'
    $content = $content -replace 'green-200','orange-200'
    $content = $content -replace 'green-500','orange-500'
    $content = $content -replace 'green-600','orange-600'
    $content = $content -replace 'green-700','orange-700'
    
    Set-Content $file.FullName -Value $content -NoNewline
}

Write-Host "Branding applied successfully!"
