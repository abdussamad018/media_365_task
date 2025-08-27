# 🚀 Bulk Thumbnail Processor

A modern, responsive web application built with Laravel, Inertia.js, and React for bulk image thumbnail processing with enterprise-grade features.

## ✨ Features

- **🔐 Authentication System**: Secure login/register with user management
- **🖼️ Bulk Image Processing**: Process multiple images simultaneously
- **📊 Subscription Tiers**: Free, Pro, and Enterprise plans with different quotas
- **🎨 Modern UI/UX**: Beautiful, responsive design using Shopify Polaris components
- **📱 Mobile-First**: Fully responsive design for all devices
- **⚡ High Performance**: Optimized for enterprise-grade processing
- **🔒 Secure**: Built-in security features and data protection

## 🛠️ Tech Stack

### Backend
- **Laravel 11** - PHP framework for robust backend development
- **MySQL/PostgreSQL** - Database management
- **Laravel Sanctum** - API authentication
- **Laravel Queue** - Background job processing

### Frontend
- **React 18** - Modern JavaScript library for UI
- **Inertia.js** - Seamless SPA experience without API complexity
- **Shopify Polaris** - Professional UI component library
- **Vite** - Fast build tool and development server

### Styling & Responsiveness
- **CSS-in-JS** - Component-scoped styling
- **Media Queries** - Mobile-first responsive design
- **Flexbox/Grid** - Modern CSS layout systems

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

6. **Build assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

7. **Start the application**
   ```bash
   php artisan serve
   ```

## 📱 Demo Accounts

The application includes pre-configured demo accounts for testing:

| Plan | Quota | Priority | Features |
|------|-------|----------|----------|
| 🚀 Free | 50 images/request | Standard | Basic processing |
| ⚡ Pro | 100 images/request | High | Enhanced features |
| 🏢 Enterprise | 200 images/request | Premium | Full platform access |

## 🏗️ Project Structure

```
laravel-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Application controllers
│   │   └── Middleware/      # Custom middleware
│   ├── Models/              # Eloquent models
│   └── Jobs/                # Background jobs
├── database/
│   ├── migrations/          # Database schema
│   └── seeders/            # Sample data
├── resources/
│   ├── js/
│   │   ├── Pages/          # Inertia page components
│   │   ├── components/     # Reusable components
│   │   └── stores/         # State management
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

### Database Configuration
The application uses Laravel's default database configuration. Update your `.env` file with your database credentials.

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
- Usage tracking

### Bulk Requests Table
- Image processing requests
- Status tracking
- User association

### Image Thumbnails Table
- Processed thumbnail data
- Original image references
- Processing metadata

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
- Unit tests for models
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
- Check the documentation
- Review the code examples

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Authentication system
- Responsive UI design
- Basic image processing functionality

---

**Built with ❤️ using Laravel, Inertia.js, and React**
