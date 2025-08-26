# Quick Setup Guide

## Prerequisites
- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Redis (for queues)

## Quick Start (5 minutes)

### 1. Database Setup
```bash
# Edit .env file with your database credentials
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Set queue to Redis
QUEUE_CONNECTION=redis
```

### 2. Install & Setup
```bash
# Install dependencies
composer install

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with sample users
php artisan db:seed --class=UserSeeder
```

### 3. Start Services
```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start queue worker
php artisan queue:work redis --queue=thumbnails

# Terminal 3: Start web server
php artisan serve
```

### 4. Test the Application
- Visit: http://localhost:8000
- You'll see a demo Enterprise user (200 image quota)
- Paste some image URLs and submit
- Watch real-time processing in the queue worker terminal

## Test Data
The seeder creates 3 users:
- **Free User**: 50 images, 1x priority
- **Pro User**: 100 images, 2x priority  
- **Enterprise User**: 200 images, 3x priority

## Demo URLs to Test
```
https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg
https://example.com/image4.jpg
https://example.com/image5.jpg
```

## What You'll See
- Priority-based processing (Enterprise > Pro > Free)
- Real-time status updates
- Quota enforcement
- Background job processing
- Success/failure simulation (80% success rate)

## Troubleshooting
- **Queue not working**: Check if Redis is running
- **Database errors**: Verify credentials in .env
- **Jobs not processing**: Ensure queue worker is running
- **Permission issues**: Check storage/cache directory permissions

## Next Steps
- Customize the UI with Shopify Polaris
- Add real thumbnail generation
- Implement WebSocket real-time updates
- Add user authentication
- Create admin dashboard
