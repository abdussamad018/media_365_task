# 🔧 Technical Documentation

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Design](#database-design)
3. [API Endpoints](#api-endpoints)
4. [Frontend Architecture](#frontend-architecture)
5. [Authentication System](#authentication-system)
6. [Responsive Design System](#responsive-design-system)
7. [State Management](#state-management)
8. [Performance Optimization](#performance-optimization)
9. [Security Implementation](#security-implementation)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React +      │◄──►│   (Laravel +    │◄──►│   (MySQL/      │
│   Inertia.js)   │    │   Inertia.js)   │    │   PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vite Build    │    │   Queue System  │    │   File Storage  │
│   System        │    │   (Background   │    │   (Local/Cloud) │
│                 │    │   Jobs)         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Details

#### Backend (Laravel 11)
- **Framework**: Laravel 11 with PHP 8.2+
- **Authentication**: Laravel Sanctum + Session-based auth
- **Database**: Eloquent ORM with MySQL/PostgreSQL
- **Queue System**: Database queues with job prioritization
- **Validation**: Form Request validation classes
- **Middleware**: Custom authentication and guest middleware

#### Frontend (React + Inertia.js)
- **Framework**: React 18 with functional components
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Inertia.js for SPA-like experience
- **UI Components**: Shopify Polaris design system
- **Styling**: CSS-in-JS with responsive media queries
- **Build Tool**: Vite for fast development and building

## 🗄️ Database Design

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    subscription_tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    quota_limit INT DEFAULT 50,
    quota_used INT DEFAULT 0,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Bulk Requests Table
```sql
CREATE TABLE bulk_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    total_images INT NOT NULL,
    processed_images INT DEFAULT 0,
    failed_images INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Image Thumbnails Table
```sql
CREATE TABLE image_thumbnails (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bulk_request_id BIGINT UNSIGNED NOT NULL,
    original_url TEXT NOT NULL,
    thumbnail_url TEXT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    error_message TEXT NULL,
    processing_time DECIMAL(8,2) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (bulk_request_id) REFERENCES bulk_requests(id) ON DELETE CASCADE
);
```

### Database Relationships
- **User** → **BulkRequest** (One-to-Many)
- **BulkRequest** → **ImageThumbnail** (One-to-Many)
- **User** → **ImageThumbnail** (One-to-Many through BulkRequest)

### Indexes and Performance
```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bulk_requests_user_id ON bulk_requests(user_id);
CREATE INDEX idx_bulk_requests_status ON bulk_requests(status);
CREATE INDEX idx_image_thumbnails_bulk_request_id ON image_thumbnails(bulk_request_id);
CREATE INDEX idx_image_thumbnails_status ON image_thumbnails(status);
```

## 🌐 API Endpoints

### Authentication Routes
```php
// Guest routes
Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
```

### API Response Format
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "subscription_tier": "pro",
            "quota_limit": 100,
            "quota_used": 25
        }
    },
    "message": "Login successful"
}
```

### Error Handling
```json
{
    "success": false,
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    },
    "message": "Validation failed"
}
```

## 🎨 Frontend Architecture

### Component Structure
```
src/
├── Pages/
│   ├── Auth/
│   │   ├── Login.jsx          # Login page component
│   │   └── Register.jsx       # Registration page component
│   ├── Dashboard.jsx          # Main dashboard component
│   └── App.jsx               # Root application component
├── Components/
│   ├── Layout/                # Layout components
│   ├── Forms/                 # Form components
│   └── UI/                    # Reusable UI components
└── Stores/                    # State management
```

### Component Patterns

#### Functional Components with Hooks
```jsx
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}
```

#### Responsive Design Implementation
```jsx
// CSS-in-JS with responsive breakpoints
const containerStyle = {
    display: 'flex',
    flexDirection: 'row', // Desktop: side-by-side
    // Mobile: column (handled by CSS media queries)
};

// CSS classes for responsive behavior
<div className="login-container">
    <div className="login-form-side">
        {/* Content */}
    </div>
</div>
```

### State Management
- **Local State**: useState for component-specific data
- **Form State**: useForm from Inertia.js for form handling
- **Global State**: Inertia.js shared data for user information
- **Server State**: Automatic synchronization with backend

## 🔐 Authentication System

### Notification System

The application includes a comprehensive notification system that keeps users informed about their thumbnail processing status:

#### Notification Types
- **ThumbnailReadyNotification**: Sent when individual thumbnails are processed (success/failure)
- **BulkRequestCompletedNotification**: Sent when entire bulk requests are completed

#### Notification Channels
- **Database**: Stored in notifications table for in-app display
- **Email**: Sent via Laravel's mail system (configurable)

#### Notification Features
- Real-time unread count updates
- Notification preferences management
- Mark as read/unread functionality
- Notification history and statistics
- Toast notifications for new alerts

#### Notification Components
- **NotificationBell**: Main notification interface with popover
- **NotificationSettings**: User preference management
- **NotificationController**: Backend API endpoints

#### Database Schema
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT UNSIGNED NOT NULL,
    data TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Authentication Flow
1. **User Registration**
   - Form validation
   - Password hashing
   - Subscription tier assignment
   - Database user creation

2. **User Login**
   - Credential verification
   - Session creation
   - CSRF token generation
   - Redirect to dashboard

3. **Session Management**
   - Laravel session driver
   - Remember me functionality
   - Automatic logout on inactivity

### Security Features
```php
// CSRF Protection
Route::middleware(['web'])->group(function () {
    // All routes automatically protected
});

// Authentication Middleware
Route::middleware(['auth'])->group(function () {
    // Protected routes
});

// Guest Middleware
Route::middleware(['guest'])->group(function () {
    // Public routes (redirect if authenticated)
});
```

### Password Security
```php
// Password hashing in User model
protected $hidden = ['password', 'remember_token'];

// Password validation rules
'password' => [
    'required',
    'string',
    'min:8',
    'confirmed'
]
```

## 📱 Responsive Design System

### Breakpoint Strategy
```css
/* Mobile First Approach */
/* Base styles for mobile */

/* Tablet and up */
@media (min-width: 768px) {
    /* Tablet styles */
}

/* Desktop and up */
@media (min-width: 1024px) {
    /* Desktop styles */
}

/* Large screens */
@media (min-width: 1440px) {
    /* Large screen styles */
}
```

### Layout Patterns

#### Flexbox Layout System
```css
.login-container {
    display: flex;
    flex-direction: row; /* Desktop: side-by-side */
}

@media (max-width: 768px) {
    .login-container {
        flex-direction: column; /* Mobile: stacked */
    }
}
```

#### Grid System
```css
.form-grid {
    display: grid;
    grid-template-columns: 1fr; /* Mobile: single column */
    gap: 1rem;
}

@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr 1fr; /* Desktop: two columns */
    }
}
```

### Typography Scale
```css
/* Responsive typography */
.login-title {
    font-size: 1.5rem; /* 24px - Mobile */
    line-height: 1.2;
}

@media (min-width: 768px) {
    .login-title {
        font-size: 1.75rem; /* 28px - Desktop */
    }
}
```

### Spacing System
```css
/* 8px grid system */
.spacing-xs { margin: 0.5rem; }  /* 8px */
.spacing-sm { margin: 1rem; }    /* 16px */
.spacing-md { margin: 1.5rem; }  /* 24px */
.spacing-lg { margin: 2rem; }    /* 32px */
.spacing-xl { margin: 3rem; }    /* 48px */
```

## 🚀 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and responsive images

### Backend Optimization
- **Database Queries**: Eager loading and query optimization
- **Caching**: Redis caching for frequently accessed data
- **Queue System**: Background job processing
- **API Response**: Optimized JSON responses

### Build Optimization
```javascript
// vite.config.js
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    polaris: ['@shopify/polaris']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    }
});
```

## 🔒 Security Implementation

### CSRF Protection
```php
// Automatic CSRF token generation
<meta name="csrf-token" content="{{ csrf_token() }}">

// Form CSRF protection
@csrf
```

### Input Validation
```php
// Form Request Validation
class LoginRequest extends FormRequest
{
    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ];
    }
}
```

### SQL Injection Prevention
```php
// Eloquent ORM (automatic protection)
User::where('email', $email)->first();

// Parameter binding
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

### XSS Protection
```php
// Automatic HTML escaping in Blade
{{ $user->name }}

// Raw HTML (when needed)
{!! $user->bio !!}
```

## 🧪 Testing Strategy

### Testing Pyramid
```
        /\
       /  \     E2E Tests (Few)
      /____\    
     /      \   Integration Tests (Some)
    /________\  
   /          \ Unit Tests (Many)
  /____________\
```

### PHP Testing (PHPUnit)
```php
// Feature Test Example
class LoginTest extends TestCase
{
    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create();
        
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        
        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();
    }
}
```

### Frontend Testing (Jest + React Testing Library)
```jsx
// Component Test Example
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('renders login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
```

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 70%+ coverage
- **E2E Tests**: Critical user flows

## 🚀 Deployment Guide

### Production Environment Setup
```bash
# Environment configuration
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database configuration
DB_CONNECTION=mysql
DB_HOST=production-db-host
DB_DATABASE=production_db
DB_USERNAME=production_user
DB_PASSWORD=secure_password

# Cache and session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Deployment Commands
```bash
# Production deployment
composer install --optimize-autoloader --no-dev
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
```

### Server Configuration
```nginx
# Nginx configuration
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    root /var/www/html/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### SSL Configuration
```bash
# Let's Encrypt SSL setup
sudo certbot --nginx -d yourdomain.com

# SSL configuration in .env
FORCE_HTTPS=true
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Issues
```bash
# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Regenerate application key
php artisan key:generate
```

#### 2. Database Connection Issues
```bash
# Check database connection
php artisan tinker
DB::connection()->getPdo();

# Run migrations
php artisan migrate:status
php artisan migrate
```

#### 3. Frontend Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run build --force
```

#### 4. Queue Processing Issues
```bash
# Check queue status
php artisan queue:work --verbose

# Restart queue workers
php artisan queue:restart

# Priority-based queue processing
php artisan queue:work --queue=enterprise,pro,free

# Monitor priority queues
php artisan queue:monitor-priority
php artisan queue:monitor-priority --live
```

### Debug Mode
```php
// Enable debug mode in development
APP_DEBUG=true
APP_ENV=local

// Check Laravel logs
tail -f storage/logs/laravel.log
```

### Performance Monitoring
```bash
# Database query monitoring
DB::enableQueryLog();
// ... your code ...
dd(DB::getQueryLog());

# Memory usage monitoring
memory_get_usage(true);
memory_get_peak_usage(true);
```

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Support

For technical support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the code examples
- Consult the official documentation

---

**This technical documentation is maintained by the development team and should be updated with any architectural changes.**
