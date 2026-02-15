# VEB Store - E-commerce Website Setup

## Features Implemented

✅ **Payment Options**
- PayPal integration
- Debit/Credit Card (RuPay, Visa, Mastercard)
- Cash on Delivery (COD)

✅ **Email Notifications**
- Order confirmation emails using Nodemailer
- Professional HTML email templates
- Customer order details and tracking

✅ **Complete Checkout Flow**
- Customer information form
- Payment method selection
- Order success page with confirmation
- Transaction ID generation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Service

**Important:** You need to configure the email service in `server.js`:

1. Open `server.js`
2. Replace the email configuration:
```javascript
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'support@vebstore.in', // Replace with your Gmail
    pass: 'your-app-password'     // Replace with your Gmail App Password
  }
});
```

3. **Get Gmail App Password:**
   - Go to your Google Account settings
   - Enable 2-factor authentication
   - Go to Security → App passwords
   - Generate a new app password for "Mail"
   - Use this password in the server configuration

**Contact Information Updated:**
- Email: support@vebstore.in
- Phone: +91 98765 43210
- Location: Hyderabad, India

### 3. Start the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev:full
```

**Option 2: Run separately**
```bash
# Terminal 1 - Start backend server
npm run server

# Terminal 2 - Start frontend development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001

## How to Use

1. **Add products to cart** from the products page
2. **Go to cart** and click "Proceed to Checkout"
3. **Fill customer information** (name, email, phone, address)
4. **Select payment method**:
   - PayPal (simulated)
   - Debit/Credit Card (simulated)
   - Cash on Delivery
5. **Place order** - you'll receive:
   - Success message with order ID
   - Order confirmation email
   - Redirect to order success page

## Email Template Features

- Professional VEB Store branding
- Order details with items and quantities
- Transaction ID and payment method
- Customer information
- Responsive HTML design

## Payment Processing

All payment methods are currently **simulated** for demonstration:
- PayPal: Returns success after 2 seconds
- Card payments: Returns success after 2 seconds  
- COD: Immediate confirmation

## File Structure

```
src/
├── pages/
│   ├── Checkout.tsx      # New checkout page with payment options
│   ├── OrderSuccess.tsx  # Order confirmation page
│   └── Cart.tsx          # Updated to redirect to checkout
├── context/
│   └── CartContext.tsx   # Shopping cart management
server.js                 # Backend server for emails and payments
```

## Environment Variables (Optional)

Create a `.env` file for production:
```
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:8080
```

## Troubleshooting

**Email not sending:**
- Check Gmail app password configuration
- Ensure 2-factor authentication is enabled
- Verify email and password are correct

**Server not starting:**
- Check if port 3001 is available
- Ensure all dependencies are installed
- Check for syntax errors in server.js

**Frontend issues:**
- Clear browser cache
- Check console for errors
- Ensure backend server is running

## Production Deployment

For production deployment:
1. Configure real payment gateways (PayPal SDK, Stripe, etc.)
2. Use environment variables for sensitive data
3. Set up proper email service (SendGrid, AWS SES, etc.)
4. Deploy frontend to Vercel/Netlify
5. Deploy backend to Railway/Heroku/AWS
