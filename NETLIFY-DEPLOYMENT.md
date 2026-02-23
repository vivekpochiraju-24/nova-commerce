# 🚀 Netlify Deployment Guide for Nova Commerce

## 📋 Prerequisites

- Netlify account
- GitHub repository with your code
- Node.js 18+ dependencies already installed

## 🔧 Step-by-Step Deployment

### 1. **Prepare Your Repository**

Make sure your repository includes:
- ✅ `netlify.toml` configuration file
- ✅ `netlify/functions/` directory with serverless functions
- ✅ Updated API configuration for Netlify

### 2. **Connect to Netlify**

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Select the Nova Commerce repository

### 3. **Configure Build Settings**

```bash
Build command: npm run build
Publish directory: dist
```

### 4. **Set Environment Variables**

In Netlify dashboard → Site settings → Environment variables:

```bash
# Required for JWT tokens
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: For email functionality
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: For AI chatbot
OPENAI_API_KEY=your-openai-api-key

# Supabase (if using)
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=your-supabase-url
```

### 5. **Deploy!**

Click "Deploy site" and wait for the build to complete.

## 🔧 What's Configured

### Serverless Functions

The following API endpoints are now available as Netlify functions:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/users` - Get all users (admin only)
- `GET /api/products` - Get products
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist` - Add to wishlist

### URL Rewrites

All `/api/*` requests are automatically routed to Netlify functions:

```
/api/auth/login → /.netlify/functions/api/auth/login
/api/products → /.netlify/functions/api/products
```

### SPA Support

All non-API requests are routed to `index.html` for React Router to handle.

## 🚨 Important Notes

### 1. **WebSocket Limitations**
Netlify serverless functions don't support WebSockets. Real-time features will be disabled in production on Netlify.

### 2. **Data Persistence**
Current setup uses in-memory storage. Data will reset on each function deployment. For production:

- **Option A**: Use Netlify's KV storage
- **Option B**: Connect to external database (MongoDB, PostgreSQL)
- **Option C**: Use Supabase for real-time features

### 3. **Admin User**
Default admin credentials are automatically created:
- Email: `admin@vebstore.com`
- Password: `admin123`

## 🧪 Testing After Deployment

1. **Registration Test**
   - Go to your Netlify URL
   - Try to register a new user
   - Should work without errors

2. **Login Test**
   - Use admin credentials to login
   - Should redirect to admin dashboard

3. **API Test**
   - Check browser network tab
   - All API calls should go to `/.netlify/functions/*`

## 🔍 Debugging Common Issues

### Registration Failed

**Check:**
- Environment variables are set correctly
- JWT_SECRET is defined
- Function logs in Netlify dashboard

**Solution:**
```bash
# Set JWT_SECRET in Netlify environment variables
JWT_SECRET=your-secret-key-at-least-32-characters-long
```

### CORS Errors

**Check:**
- `netlify.toml` has correct CORS headers
- Functions are using cors middleware

**Solution:**
CORS is already configured in `netlify.toml` and functions.

### 404 Errors

**Check:**
- Functions are in correct directory: `netlify/functions/`
- `netlify.toml` redirects are correct

**Solution:**
Ensure directory structure:
```
netlify/
├── functions/
│   └── api/
│       ├── auth/
│       │   ├── login.js
│       │   └── register.js
│       ├── products.js
│       ├── users.js
│       └── wishlist.js
└── toml
```

## 📦 Production Database Setup

For a real production deployment, replace the in-memory storage:

### Option 1: Supabase Integration
```javascript
// In your functions, replace in-memory storage with:
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
```

### Option 2: MongoDB Integration
```javascript
// Add MongoDB connection:
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URL);
```

## 🚀 Advanced Configuration

### Custom Domain
1. Go to Site settings → Domain management
2. Add your custom domain
3. Update DNS records

### Form Submissions
Netlify Forms can handle contact forms:
```html
<form name="contact" method="POST" data-netlify="true">
  <!-- Form fields -->
</form>
```

### Analytics
Enable Netlify Analytics in Site settings → Analytics

## 📞 Support

If you encounter issues:

1. **Check Function Logs**: Netlify dashboard → Functions → Logs
2. **Check Build Logs**: Netlify dashboard → Deploys → Build log
3. **Verify Environment Variables**: Site settings → Environment variables
4. **Test Locally**: Use Netlify CLI to test functions locally

```bash
npm install -g netlify-cli
netlify dev
```

---

**Your Nova Commerce store is now ready for Netlify deployment!** 🎉

The registration and login issues should be completely resolved with the serverless function setup.
