# 🚀 Bulk Thumbnail Processor - Senior Backend Engineer Task

A modern, enterprise-grade web application built with Laravel, Inertia.js, and React for bulk image thumbnail processing with intelligent queue prioritization and real-time status updates.

## ✨ Core Features

- **🔐 Authentication System**: Secure login/register with user management
- **🖼️ Bulk Image Processing**: Process multiple images simultaneously with background jobs
- **📊 Subscription Tiers**: Free (50), Pro (100), Enterprise (200) images per request
- **⚡ Priority Queue System**: Enterprise (3x), Pro (2x), Free (1x) priority processing
- **🎨 Modern UI/UX**: Beautiful, responsive design using Shopify Polaris components
- **📱 Mobile-First**: Fully responsive design for all devices
- **🔄 Real-time Updates**: Automatic status updates with polling mechanism
- **🔒 Secure**: Built-in security features and data protection

## 🛠️ Tech Stack

### Backend
- **Laravel 11** - PHP framework for robust backend development
- **MySQL/PostgreSQL** - Database management with migrations
- **Laravel Queue** - Background job processing with priority-based queues
- **Laravel Sanctum** - API authentication and session management
- **Laravel Notifications** - User notification system

### Frontend
- **React 18** - Modern JavaScript library for UI
- **Inertia.js** - Seamless SPA experience without API complexity
- **Shopify Polaris** - Professional UI component library
- **Vite** - Fast build tool and development server

### Queue System
- **Priority Queues**: Separate queues for each subscription tier
- **Job Prioritization**: Automatic priority assignment based on user tier
- **Background Processing**: Asynchronous image processing simulation
- **Error Handling**: Comprehensive error handling with retry mechanisms

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL/PostgreSQL
- XAMPP/WAMP (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd laravel-app
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database configuration**
   ```bash
   # Update .env with your database credentials
   php artisan migrate
   php artisan db:seed
   ```

6. **Queue setup**
   ```bash
   # Start queue worker for background processing
   php artisan queue:work --queue=enterprise,pro,free
   ```

7. **Build assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

8. **Start the application**
   ```bash
   php artisan serve
   ```

## 📱 Demo Accounts

The application includes pre-configured demo accounts for testing:

| Plan | Quota | Priority | Features |
|------|-------|----------|----------|
| 🎯 Free | 50 images/request | 1x | Standard processing |
| ⚡ Pro | 100 images/request | 2x | Enhanced processing speed |
| 🏢 Enterprise | 200 images/request | 3x | Premium processing speed |

## 🏗️ Project Structure

```
laravel-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Application controllers
│   │   └── Middleware/      # Custom middleware
│   ├── Models/              # Eloquent models
│   ├── Jobs/                # Background jobs with priority
│   └── Notifications/       # User notification system
├── database/
│   ├── migrations/          # Database schema
│   └── seeders/            # Sample data
├── resources/
│   ├── js/
│   │   ├── Pages/          # Inertia page components
│   │   ├── Components/     # Reusable components
│   │   └── app.jsx         # Main application entry
│   └── views/              # Blade templates
├── routes/                  # Application routes
└── storage/                 # File storage
```

## 🔧 Configuration

### Environment Variables
```env
APP_NAME="Bulk Thumbnail Processor"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bulk_thumbnail_processor
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database
SESSION_DRIVER=file
CACHE_DRIVER=file
```

### Queue Configuration
The application uses priority-based queues:
- `enterprise` - Highest priority (3x)
- `pro` - Medium priority (2x)
- `free` - Standard priority (1x)

## 🎨 UI Components

### Design System
- **Color Palette**: Professional gradients and modern colors
- **Typography**: Clear hierarchy with readable fonts
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle depth and elevation

### Responsive Breakpoints
- **Desktop**: >768px - Side-by-side layout
- **Mobile**: ≤768px - Stacked vertical layout

### Component Library
- **Forms**: Polaris TextField, Select, Button components
- **Layout**: Custom responsive containers and grids
- **Feedback**: Polaris Banner for error/success messages
- **Tables**: Dynamic data tables with filtering

## 🔐 Authentication

### Features
- User registration with subscription tier selection
- Secure login with session management
- Guest middleware for unauthenticated routes
- Automatic redirects for authenticated users

### Routes
- `/login` - User authentication
- `/register` - User registration
- `/dashboard` - Main application (protected)
- `/logout` - Session termination

## 📊 Database Schema

### Users Table
- Basic user information
- Subscription tier and quota management
- Priority multiplier calculation

### Bulk Requests Table
- Image processing requests
- Status tracking (pending, processing, completed)
- Priority and processing metadata

### Image Thumbnails Table
- Processed thumbnail data
- Original image references
- Processing status and error handling

## 🚀 Queue System Architecture

### Priority Processing
- **Enterprise Users**: 3x priority, fastest processing
- **Pro Users**: 2x priority, enhanced processing
- **Free Users**: 1x priority, standard processing

### Job Processing
- Automatic queue assignment based on user tier
- Priority-based processing delays
- Simulated Node.js service integration
- Comprehensive error handling and retry logic

### Real-time Updates
- Automatic status polling every 10 seconds
- Progress tracking for bulk requests
- User notifications for completed requests

## 🚀 Deployment

### Production Requirements
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL/PostgreSQL
- Redis (for queues)
- Web server (Nginx/Apache)

### Deployment Steps
1. Set `APP_ENV=production`
2. Configure production database
3. Run `php artisan migrate --force`
4. Build production assets: `npm run build`
5. Configure web server
6. Set up SSL certificates
7. Configure queue workers for production

## 🧪 Testing

### Running Tests
```bash
# PHP tests
php artisan test

# Frontend tests
npm run test
```

### Test Coverage
- Feature tests for authentication
- Unit tests for models and jobs
- Queue processing tests
- Frontend component testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the technical documentation
- Review the code examples

## 🔄 Changelog

### Version 1.0.0
- Initial release with priority queue system
- Authentication system with subscription tiers
- Responsive UI design using Shopify Polaris
- Background job processing with Laravel Queue
- Real-time status updates and notifications

---

**Built with ❤️ using Laravel, Inertia.js, and React**

**Senior Backend Engineer Task Implementation - Abdus Samad**
