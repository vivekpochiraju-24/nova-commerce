# Nova Commerce Deployment Guide

## 🚀 Production Deployment

This guide will help you deploy Nova Commerce to any hosting platform (Vercel, Netlify, Heroku, DigitalOcean, etc.).

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB or PostgreSQL database (for production)
- Redis (for real-time features)

## 🔧 Environment Variables

Set these environment variables on your hosting platform:

```bash
# API Configuration
VITE_API_URL=/api

# Database
DATABASE_URL=your_database_connection_string
REDIS_URL=your_redis_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Supabase (if using)
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🏗️ Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Start Production Server
```bash
npm start
```

## 🌐 Platform-Specific Deployment

### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Add `vercel.json` configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add `netlify/functions` for serverless functions
4. Set environment variables in Netlify dashboard

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
# Set all environment variables
git push heroku main
```

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Configure environment variables

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to git
3. **Database**: Use connection pooling and SSL
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **CORS**: Configure CORS for your domain only
6. **JWT**: Use strong JWT secrets and implement refresh tokens

## 📊 Monitoring & Logging

1. **Error Tracking**: Use Sentry or similar
2. **Performance**: Monitor API response times
3. **Analytics**: Track user behavior and sales
4. **Logs**: Centralize application logs

## 🔄 Real-time Features

For real-time features to work in production:

1. **WebSocket Server**: Configure WebSocket secure connections (WSS)
2. **Redis**: Use Redis for WebSocket session management
3. **Load Balancer**: Configure sticky sessions if using load balancers

## 🛠️ Troubleshooting

### Common Issues

1. **Login Failures**
   - Check API URL configuration
   - Verify environment variables
   - Check CORS settings

2. **Real-time Not Working**
   - Verify WebSocket configuration
   - Check Redis connection
   - Ensure firewall allows WebSocket connections

3. **Payment Issues**
   - Verify Razorpay keys
   - Check webhook URLs
   - Ensure HTTPS is configured

### Debug Mode

Enable debug logging:
```bash
DEBUG=nova-commerce:* npm start
```

## 📱 Mobile Optimization

The app is fully responsive and works on:
- iOS Safari 12+
- Chrome Mobile 80+
- Samsung Internet 12+

## 🚀 Performance Optimization

1. **Caching**: Implement Redis caching
2. **CDN**: Use CDN for static assets
3. **Images**: Optimize and compress images
4. **Code Splitting**: Already implemented with React.lazy
5. **Service Worker**: Consider for offline support

## 📈 Scaling

When scaling to handle more traffic:

1. **Database**: Use read replicas
2. **Redis**: Cluster Redis for high availability
3. **Load Balancer**: Distribute traffic across multiple instances
4. **CDN**: Serve static assets from edge locations

## 🔄 CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to production
        run: # Your deployment command
```

## 📞 Support

For deployment issues:
1. Check the logs: `heroku logs --tail` (or equivalent)
2. Verify all environment variables are set
3. Ensure database is accessible from production
4. Test API endpoints individually

---

**Note**: This deployment guide assumes you have the backend API and frontend in the same repository. If you're deploying them separately, adjust the configurations accordingly.
