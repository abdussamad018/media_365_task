# 🚀 Quick Start Guide

Get your Bulk Thumbnail Processor running in 5 minutes!

## ⚡ Quick Setup

### 1. **Start the Application**
```bash
php artisan serve
```
Your app will be available at: `http://localhost:8000`

### 2. **Start Queue Worker** (in new terminal)
```bash
php artisan queue:work --queue=thumbnails
```

### 3. **Login with Demo Account**
- Go to: `http://localhost:8000/login`
- Use: `enterprise@example.com` / `password`
- This gives you 200 images per request with 3x priority!

## 🎯 Test the System

### **Submit Your First Request**
1. Click "Process New Images" button
2. Paste these test URLs:
   ```
   https://via.placeholder.com/800x600/FF0000/FFFFFF?text=Image+1
   https://via.placeholder.com/800x600/00FF00/FFFFFF?text=Image+2
   https://via.placeholder.com/800x600/0000FF/FFFFFF?text=Image+3
   ```
3. Click "Process Images"
4. Watch real-time updates every 10 seconds!

### **Try Different User Types**
- **Free**: `free@example.com` / `password` (50 images, 1x priority)
- **Pro**: `pro@example.com` / `password` (100 images, 2x priority)  
- **Enterprise**: `enterprise@example.com` / `password` (200 images, 3x priority)

## 🔧 Troubleshooting

### **If Queue Not Working**
```bash
# Check Redis connection
redis-cli ping

# Start queue worker with verbose output
php artisan queue:work --queue=thumbnails --verbose
```

### **If Frontend Not Loading**
```bash
# Rebuild assets
npm run build

# Check for errors
npm run dev
```

### **If Database Issues**
```bash
# Check migration status
php artisan migrate:status

# Re-run migrations
php artisan migrate:fresh --seed
```

## 📱 What You'll See

- **Beautiful Login/Register Pages** with Shopify Polaris UI
- **Modern Dashboard** with real-time updates
- **Progress Bars** showing processing status
- **Status Badges** for each image (pending, processing, completed, failed)
- **Priority Indicators** showing your processing priority
- **Quota Management** with visual progress bars

## 🎉 You're Ready!

Your Bulk Thumbnail Processor is now running with:
- ✅ Modern React + Shopify Polaris UI
- ✅ Priority-based queue system
- ✅ Real-time status updates
- ✅ Three-tier user system
- ✅ Beautiful, responsive design

Start processing images and enjoy the enterprise-grade experience! 🚀
