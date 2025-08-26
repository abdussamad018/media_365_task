# Bulk Thumbnail Processor

A Laravel application that simulates bulk image thumbnail processing using a queue system with priority management based on user subscription tiers.

## Features

- **User Tiers**: Free (50 images), Pro (100 images), Enterprise (200 images)
- **Priority System**: Enterprise (3x), Pro (2x), Free (1x) priority over queue processing
- **Background Processing**: Uses Laravel queues with Redis backend
- **Real-time Updates**: Auto-refresh every 10 seconds
- **Status Tracking**: Monitor processing status for each image
- **Quota Management**: Enforce limits based on subscription tier

## Requirements

- PHP 8.1+
- Laravel 10+
- MySQL/PostgreSQL
- Redis (for queue processing)
- Composer

## Installation

1. **Clone and install dependencies:**
   ```bash
   composer install
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   
   QUEUE_CONNECTION=redis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   ```

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Seed database:**
   ```bash
   php artisan db:seed --class=UserSeeder
   ```

6. **Start Redis server:**
   ```bash
   redis-server
   ```

7. **Start queue worker:**
   ```bash
   php artisan queue:work redis --queue=thumbnails
   ```

8. **Start development server:**
   ```bash
   php artisan serve
   ```

## Usage

1. Visit the application in your browser
2. The system will automatically create a demo user (Enterprise tier)
3. Paste image URLs (one per line) in the textarea
4. Submit to start processing
5. Monitor real-time status updates
6. View results in the table below

## Architecture

### Models
- **User**: Manages subscription tiers and quotas
- **BulkRequest**: Handles bulk processing requests
- **ImageThumbnail**: Individual image processing status

### Jobs
- **ProcessThumbnailJob**: Simulates Node.js service processing

### Queue System
- Uses Redis as queue backend
- Priority-based job processing
- Automatic retry on failure (3 attempts)
- Job timeout: 5 minutes

### Priority Logic
- Enterprise users: 3x priority multiplier
- Pro users: 2x priority multiplier  
- Free users: 1x priority multiplier

## API Endpoints

- `GET /` - Main interface
- `POST /thumbnails` - Submit bulk request
- `GET /thumbnails/{id}/status` - Get processing status
- `GET /thumbnails/results` - Get filtered results

## Simulation Details

The application simulates:
- Node.js service processing (1-5 second delays)
- 80% success rate for thumbnail generation
- Random processing failures
- Background job processing with queues

## Future Enhancements

- WebSocket real-time updates
- Shopify Polaris UI integration
- Actual thumbnail generation service
- User authentication system
- Admin dashboard
- Analytics and reporting

## Troubleshooting

- **Queue not working**: Ensure Redis is running and `QUEUE_CONNECTION=redis` in `.env`
- **Jobs not processing**: Check if queue worker is running with `php artisan queue:work`
- **Database errors**: Verify database credentials and run migrations
- **Permission issues**: Check storage and bootstrap/cache directory permissions

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
