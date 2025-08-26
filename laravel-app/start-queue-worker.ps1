Write-Host "Starting Laravel Queue Worker..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure Redis is running first!" -ForegroundColor Yellow
Write-Host ""
php artisan queue:work redis --queue=thumbnails --verbose
Read-Host "Press Enter to continue..."
