// Generate Ethereal test account for email testing
import { createTestAccount } from 'nodemailer/lib/mailer';

async function setupEmail() {
  try {
    console.log('🔧 Creating test email account...');
    
    // Create Ethereal account
    const testAccount = await createTestAccount();
    
    console.log('✅ Test email account created!');
    console.log('📧 Email:', testAccount.user);
    console.log('🔑 Password:', testAccount.pass);
    console.log('🌐 Preview URL:', testAccount.web);
    
    console.log('\n📋 Copy these credentials to server.js:');
    console.log('user:', testAccount.user);
    console.log('pass:', testAccount.pass);
    
    console.log('\n🌐 You can preview emails at:', testAccount.web);
    console.log('📧 No real emails will be sent - perfect for testing!');
    
  } catch (error) {
    console.error('❌ Error creating test account:', error);
  }
}

setupEmail();
