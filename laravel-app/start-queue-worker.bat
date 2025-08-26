@echo off
echo Starting Laravel Queue Worker...
echo.
echo Make sure Redis is running first!
echo.
php artisan queue:work redis --queue=thumbnails --verbose
pause
