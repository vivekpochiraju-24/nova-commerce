// Test email functionality
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_GMAIL@gmail.com', // ⚠️ REPLACE with your actual Gmail
    pass: 'YOUR_APP_PASSWORD'     // ⚠️ REPLACE with your Gmail App Password
  }
});

const testEmail = async () => {
  try {
    const mailOptions = {
      from: 'support@vebstore.in',
      to: 'YOUR_GMAIL@gmail.com', // Send test to yourself
      subject: '🧪 VEB Store - Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">VEB Store</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Email Test</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">🎉 Email Test Successful!</h2>
            <p style="color: #666; line-height: 1.6;">If you receive this email, your email configuration is working correctly.</p>
            <p style="color: #666; line-height: 1.6;">Orders will now send confirmation emails to customers.</p>
            
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #155724;"><strong>✅ Next Steps:</strong></p>
              <ul style="color: #155724; margin: 10px 0;">
                <li>Place a test order on the website</li>
                <li>Check your inbox for confirmation email</li>
                <li>Verify admin dashboard shows the order</li>
              </ul>
            </div>
          </div>
        </div>
      `
    };

    console.log('🧪 Sending test email...');
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Check your inbox for the test email');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Enable 2-factor authentication on your Google Account');
    console.log('2. Generate an App Password at: https://myaccount.google.com/apppasswords');
    console.log('3. Use the App Password (not your regular password)');
    console.log('4. Make sure Gmail address is correct');
  }
};

testEmail();
