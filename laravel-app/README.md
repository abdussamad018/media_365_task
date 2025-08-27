# Bulk Thumbnail Processor

A modern Laravel application with Inertia.js, React, and Shopify Polaris UI for processing bulk image thumbnails with priority-based queue management.

## ✨ Features

### 🎯 **Three-Tier User System**
- **Free Plan**: 50 images per request, 1x priority
- **Pro Plan**: 100 images per request, 2x priority  
- **Enterprise Plan**: 200 images per request, 3x priority

### 🚀 **Core Functionality**
- **Bulk Image Processing**: Submit multiple image URLs for thumbnail generation
- **Priority Queue System**: Enterprise users get 3x priority, Pro users get 2x priority
- **Real-time Updates**: Auto-refresh every 10 seconds with status updates
- **Background Processing**: Queue-based system with simulated Node.js service
- **Status Tracking**: Monitor pending, processing, completed, and failed images

### 🎨 **Modern UI with Shopify Polaris**
- **Beautiful Authentication**: Login and registration pages with modern design
- **Responsive Dashboard**: Clean, professional interface for managing requests
- **Real-time Notifications**: Toast messages for user feedback
- **Progress Indicators**: Visual progress bars and status badges

## 🛠️ Technology Stack

- **Backend**: Laravel 10 with Inertia.js
- **Frontend**: React 18 with Shopify Polaris UI
- **Queue System**: Laravel Queues with Redis support
- **Database**: MySQL with proper migrations
- **Build Tool**: Vite with React support

## 📋 Requirements

- PHP 8.1+
- Composer
- Node.js 16+
- MySQL 5.7+
- Redis (for queue processing)

## 🚀 Installation

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

5. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   
   QUEUE_CONNECTION=redis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

8. **Start the application**
   ```bash
   php artisan serve
   ```

9. **Start queue worker (in separate terminal)**
   ```bash
   php artisan queue:work --queue=thumbnails
   ```

## 👥 Demo Accounts

The application comes with pre-configured demo accounts:

| Plan | Email | Password | Quota | Priority |
|------|-------|----------|-------|----------|
| Free | `free@example.com` | `password` | 50 images | 1x |
| Pro | `pro@example.com` | `password` | 100 images | 2x |
| Enterprise | `enterprise@example.com` | `password` | 200 images | 3x |

## 🔧 Usage

### 1. **Authentication**
- Navigate to `/login` or `/register`
- Use demo accounts or create new ones
- Choose your subscription plan during registration

### 2. **Processing Images**
- Login to access the dashboard
- Click "Process New Images" button
- Paste image URLs (one per line)
- Submit and monitor progress

### 3. **Monitoring Results**
- View real-time processing status
- Filter results by status (pending, processing, completed, failed)
- Monitor quota usage and remaining capacity
- Track priority levels and processing times

## 📊 Queue Management

The application uses Laravel's queue system with priority handling:

- **Queue Name**: `thumbnails`
- **Priority Levels**: 
  - Enterprise: 3x priority
  - Pro: 2x priority  
  - Free: 1x priority
- **Processing Simulation**: 1-5 second delays with 80% success rate

## 🎨 UI Components

Built with Shopify Polaris for a professional, consistent design:

- **Cards**: Clean content containers
- **Badges**: Status indicators with color coding
- **Progress Bars**: Visual progress tracking
- **Modals**: Overlay forms for data input
- **Toast Notifications**: User feedback messages
- **Responsive Layout**: Works on all device sizes

## 🔄 Real-time Features

- **Auto-refresh**: Dashboard updates every 10 seconds
- **Live Status**: Real-time processing status updates
- **Progress Tracking**: Visual progress indicators
- **Error Handling**: Comprehensive error messages and validation

## 🚀 Development

### **Frontend Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
```

### **Queue Monitoring**
```bash
php artisan queue:work --queue=thumbnails --verbose
```

## 📁 Project Structure

```
laravel-app/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   └── ThumbnailController.php
│   ├── Jobs/
│   │   └── ProcessThumbnailJob.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── BulkRequest.php
│   │   └── ImageThumbnail.php
│   └── Http/Middleware/
│       └── HandleInertiaRequests.php
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   └── app.jsx
│   └── css/
│       └── app.css
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    ├── web.php
    └── api.php
```

## 🔒 Security Features

- **CSRF Protection**: Built-in Laravel CSRF tokens
- **Authentication**: Secure login/registration system
- **Input Validation**: Comprehensive form validation
- **Quota Management**: Prevents abuse and ensures fair usage

## 🎯 Future Enhancements

- **WebSocket Support**: Real-time updates without polling
- **File Upload**: Direct image upload support
- **API Rate Limiting**: Enhanced API security
- **Advanced Analytics**: Processing statistics and insights
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme customization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Laravel documentation
- Review Shopify Polaris component library

---

**Built with ❤️ using Laravel, Inertia.js, React, and Shopify Polaris**
