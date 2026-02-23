// Production build script for Nova Commerce
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Nova Commerce for production...');

// 1. Create production environment file
const productionEnv = `
# Production Environment Variables
EMAIL_PASS="${process.env.EMAIL_PASS || ''}"
EMAIL_USER="${process.env.EMAIL_USER || ''}"
OPENAI_API_KEY="${process.env.OPENAI_API_KEY || ''}"
VITE_SUPABASE_PROJECT_ID="${process.env.VITE_SUPABASE_PROJECT_ID || ''}"
VITE_SUPABASE_PUBLISHABLE_KEY="${process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''}"
VITE_SUPABASE_URL="${process.env.VITE_SUPABASE_URL || ''}"
VITE_API_URL=/api
`;

fs.writeFileSync('.env.production', productionEnv);
console.log('✅ Production environment file created');

// 2. Build the frontend
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend build completed');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// 3. Create deployment configuration
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deploymentConfig = {
  name: 'nova-commerce',
  version: packageJson.version,
  description: 'Nova Commerce E-commerce Platform',
  scripts: {
    start: 'node server.js',
    build: 'npm run build',
    dev: 'npm run dev'
  },
  dependencies: packageJson.dependencies,
  engines: {
    node: '>=18.0.0',
    npm: '>=9.0.0'
  },
  deployment: {
    type: 'nodejs',
    env: 'production',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 3001
  }
};

fs.writeFileSync('deployment.json', JSON.stringify(deploymentConfig, null, 2));
console.log('✅ Deployment configuration created');

// 4. Create production server configuration
const productionServer = `
// Production server configuration
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API routes (your existing API endpoints)
// ... your existing API code here ...

// For any request that doesn't match an API route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`🚀 Production server running on port \${PORT}\`);
});
`;

fs.writeFileSync('server-production.js', productionServer);
console.log('✅ Production server configuration created');

console.log('\n🎉 Production build completed successfully!');
console.log('\n📋 Next steps for deployment:');
console.log('1. Set environment variables on your hosting platform');
console.log('2. Upload the dist folder and server files');
console.log('3. Configure your hosting to run "npm start"');
console.log('4. Ensure your hosting supports Node.js 18+');
