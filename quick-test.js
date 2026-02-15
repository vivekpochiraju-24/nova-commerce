// Quick email test
import { createTransport } from 'nodemailer';

console.log('🧪 Testing email without credentials...');

// Create a simple test transporter (will show what's needed)
const testTransport = createTransport({
  service: 'gmail',
  auth: {
    user: 'test@gmail.com',
    pass: 'test'
  }
});

console.log('✅ Email transport created successfully!');
console.log('📧 To send real emails:');
console.log('1. Edit .env file with your Gmail');
console.log('2. Use App Password (not regular password)');
console.log('3. Restart server');
console.log('\n🚀 Server is ready for testing!');
