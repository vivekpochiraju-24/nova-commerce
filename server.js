import express from 'express';
import { createTransport, createTestAccount } from 'nodemailer';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'vebstore-secret-key-2024';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourTestSecretHere',
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
let users = [];
let orders = [];

// Initialize with admin user
const initAdmin = async () => {
  const adminExists = users.find(u => u.email === 'admin@vebstore.com');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    users.push({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@vebstore.com',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
    console.log('👤 Admin user initialized (admin@vebstore.com / admin123)');
  }
};

initAdmin();

// Email transporter configuration - Simple working setup
let transporter = null;

// Initialize email transporter
async function initTransporter() {
  try {
    // Try Gmail first (if credentials provided)
    transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'vivekpochiraju@gmail.com',
        pass: process.env.EMAIL_PASS || 'bahf mwho jjee gfou'
      }
    });
    console.log('📧 Gmail transporter configured');
  } catch (error) {
    console.log('⚠️ Gmail failed, using fallback');
    // Fallback to Ethereal for testing
    const testAccount = await createTestAccount();
    transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('📧 Ethereal test account configured');
    console.log('🌐 Preview emails at:', testAccount.web);
  }
}

// Initialize on startup
initTransporter();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const usersWithoutPassword = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPassword);
});

// Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Save order endpoint
app.post('/api/orders', (req, res) => {
  try {
    const orderData = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    orders.push(orderData);
    res.status(201).json({ message: 'Order saved successfully', order: orderData });
  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

// Get all orders (admin only)
app.get('/api/orders', authenticateToken, requireAdmin, (req, res) => {
  res.json(orders);
});

// Get user-specific orders
app.get('/api/orders/user', authenticateToken, (req, res) => {
  try {
    const userEmail = req.user.email;
    const userOrders = orders.filter(order => order.customerEmail === userEmail);
    res.json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order (add items)
app.put('/api/orders/:orderId', authenticateToken, (req, res) => {
  try {
    const { orderId } = req.params;
    const { items, additionalAmount } = req.body;
    const userEmail = req.user.email;
    
    const orderIndex = orders.findIndex(order => 
      order.id === orderId && order.customerEmail === userEmail
    );
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow adding items if order is pending or processing
    const order = orders[orderIndex];
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ 
        message: 'Cannot add items to shipped or delivered orders' 
      });
    }
    
    // Add new items to the order
    const newItems = items.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    
    orders[orderIndex].items.push(...newItems);
    orders[orderIndex].totalAmount += additionalAmount;
    
    res.json({ 
      message: 'Items added to order successfully',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Cancel order
app.delete('/api/orders/:orderId', authenticateToken, (req, res) => {
  try {
    const { orderId } = req.params;
    const userEmail = req.user.email;
    
    const orderIndex = orders.findIndex(order => 
      order.id === orderId && order.customerEmail === userEmail
    );
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow cancellation if order is pending or processing
    const order = orders[orderIndex];
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ 
        message: 'Cannot cancel shipped or delivered orders' 
      });
    }
    
    orders[orderIndex].status = 'cancelled';
    
    res.json({ 
      message: 'Order cancelled successfully',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

// Get products for order management
app.get('/api/products', (req, res) => {
  try {
    // Return available products that can be added to orders
    const availableProducts = [
      {
        id: 'prod1',
        name: 'Wireless Bluetooth Headphones',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        inStock: true
      },
      {
        id: 'prod2',
        name: 'Smart Watch Series 6',
        price: 15999,
        image: 'https://images.unsplash.com/photo-1523275335684-e9466b8e4a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        inStock: true
      },
      {
        id: 'prod3',
        name: 'Laptop Backpack',
        price: 1899,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        inStock: true
      }
    ];
    res.json(availableProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Order confirmation email endpoint
app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { customerEmail, customerName, orderDetails, totalAmount } = req.body;

    const mailOptions = {
      from: 'support@vebstore.in',
      to: customerEmail,
      subject: `Order Confirmation - VEB Store - Order #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">VEB Store</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Order Confirmation</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Thank you for your order, ${customerName}!</h2>
            <p style="color: #666; line-height: 1.6;">We're excited to let you know that your order has been successfully placed and is now being processed from our Hyderabad, India facility.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
              <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Items Ordered</h3>
              ${orderDetails.items.map(item => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p style="margin: 0;"><strong>${item.name}</strong></p>
                  <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × ₹${item.price}</p>
                  <p style="margin: 0; color: #667eea; font-weight: bold;">₹${item.price * item.quantity}</p>
                </div>
              `).join('')}
            </div>
            
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0; font-size: 24px;">Total Amount: ₹${totalAmount}</h3>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666;">You'll receive another email when your order ships.</p>
              <p style="color: #666;">For any questions, contact us at support@vebstore.com</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p> 2024 VEB Store. All rights reserved.</p>
          </div>
        </div>
      `
    };

    console.log(' Attempting to send email to:', customerEmail);
    console.log(' Order details:', orderDetails);
    
    await transporter.sendMail(mailOptions);
    console.log(' Email sent successfully to:', customerEmail);
    res.status(200).json({ success: true, message: 'Order confirmation email sent successfully' });
  } catch (error) {
    console.error(' Error sending email:', error);
    console.error(' Error details:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

// PayPal payment simulation endpoint
app.post('/api/process-payment', (req, res) => {
  const { paymentMethod, amount } = req.body;
  
  // Validate input
  if (!paymentMethod || !amount || amount <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid payment details provided' 
    });
  }
  
  // Simulate payment processing
  setTimeout(() => {
    try {
      if (paymentMethod === 'paypal') {
        res.status(200).json({ 
          success: true, 
          message: 'PayPal payment processed successfully',
          transactionId: 'PP' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
      } else if (paymentMethod === 'cod') {
        res.status(200).json({ 
          success: true, 
          message: 'Cash on Delivery order placed successfully',
          transactionId: 'COD' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
      } else if (paymentMethod === 'card') {
        res.status(200).json({ 
          success: true, 
          message: 'Card payment processed successfully',
          transactionId: 'CARD' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
      } else {
        res.status(400).json({ success: false, message: 'Invalid payment method selected' });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Payment processing failed due to server error' 
      });
    }
  }, 2000); // Simulate processing time
});

// Chat endpoint for AI assistant
app.post('/functions/v1/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return res.status(400).json({ error: 'User message is required' });
    }

    // Enhanced system prompt with personality and context awareness
    const systemPrompt = `You are VEB Store's AI assistant, a friendly and helpful shopping companion for an Indian e-commerce store. Your personality is:

- Warm, approachable, and genuinely helpful
- Uses natural, conversational language (avoid being overly formal)
- Shows empathy and understanding of customer needs
- Proactively offers relevant suggestions
- Uses appropriate emojis occasionally to add warmth 😊

Your capabilities:
1. Help customers find products and answer questions about the store
2. Provide information about pricing, shipping, returns, and policies
3. Assist with order-related inquiries and tracking
4. Offer personalized product recommendations based on customer needs
5. Remember context from previous messages in the conversation
6. Ask follow-up questions to better understand customer needs

Store Information:
- Store: VEB Store (Indian e-commerce platform)
- Products: Electronics (phones, laptops, accessories), Clothing (men's, women's, kids), Home & Kitchen items, Books, Beauty products
- Shipping: 3-5 business days standard, 1-2 days express
- Free shipping: Orders over ₹500
- Returns: 30-day return policy, easy process
- Payment: Credit/debit cards, UPI, net banking, COD, Wallets
- Support: support@vebstore.com, 1800-VEB-HELP (1800-832-4357)
- Hours: Monday-Saturday, 9 AM - 8 PM, Sunday 10 AM - 6 PM
- Special offers: Weekend discounts, festival sales, first-time user bonus

Conversation Guidelines:
- Reference previous messages when relevant
- If the customer mentions a product category, ask specific questions about their preferences
- Offer alternatives if something is out of stock
- Provide price comparisons when helpful
- Share tips and suggestions proactively
- If you don't know something, be honest and offer to connect with human support

Always be helpful, accurate, and maintain a positive customer service attitude. Make the customer feel valued and understood.`;

    try {
      // Use OpenAI API for real AI responses
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'sk-proj- placeholder-key'}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: true
        })
      });

      if (!openaiResponse.ok) {
        throw new Error('OpenAI API error');
      }

      // Set up Server-Sent Events for streaming
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Stream the OpenAI response
      const reader = openaiResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${JSON.stringify(parsed)}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (aiError) {
      console.error('AI API Error:', aiError);
      
      // Enhanced fallback responses with personality
      const userMessage = lastMessage.content.toLowerCase();
      const contextualResponses = [
        "I'm here to help! 🤝 What would you like to know about VEB Store? I can assist with products, orders, shipping, or any other questions you might have.",
        "Hello! I'd be happy to help you with anything related to VEB Store. What's on your mind today? 😊",
        "Hi there! I'm your personal shopping assistant at VEB Store. How can I make your shopping experience better?"
      ];
      
      let response = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];

      if (userMessage.includes('product') || userMessage.includes('item')) {
        const productResponses = [
          "We have an amazing collection of products! 🛍️ From electronics to clothing and home items - what type of product are you looking for? I can help you find exactly what you need!",
          "Great question! We offer everything from the latest electronics to fashionable clothing and home essentials. What catches your interest? I'd love to help you explore our options! ✨",
          "Our product range is quite diverse! Are you looking for something specific like electronics, clothing, or home items? Tell me more about what you have in mind! 🎯"
        ];
        response = productResponses[Math.floor(Math.random() * productResponses.length)];
      } else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('how much')) {
        const priceResponses = [
          "Great question about pricing! 💰 Our prices vary by product, but we always offer competitive rates. Plus, we have regular discounts and free shipping on orders over ₹500! Which product category are you interested in?",
          "I'd be happy to help with pricing! We offer great value across all our categories, and there's always some deal running. What's your budget range? I can suggest the best options within it! 🎯",
          "Pricing is important, and we get that! We have options for every budget, plus amazing deals. Free shipping on orders over ₹500 too! What are you looking to buy? 💳"
        ];
        response = priceResponses[Math.floor(Math.random() * priceResponses.length)];
      } else if (userMessage.includes('shipping') || userMessage.includes('delivery')) {
        const shippingResponses = [
          "Let me help you with shipping info! 📦 We offer fast delivery across India - standard (3-5 days) and express (1-2 days). Best part? Free shipping on orders over ₹500! Where would you like your order delivered?",
          "Shipping details coming right up! 🚀 We deliver nationwide in 3-5 business days, or 1-2 days if you need it urgently. Free shipping kicks in at ₹500! Need it by a specific date?",
          "Great question about delivery! 📬 We're pretty quick - 3-5 days standard, 1-2 days express. And yes, free shipping when you spend over ₹500! What's your location? I can give you more precise timing! 🗺️"
        ];
        response = shippingResponses[Math.floor(Math.random() * shippingResponses.length)];
      } else if (userMessage.includes('return') || userMessage.includes('refund')) {
        const returnResponses = [
          "Returns are super easy with us! 🔄 We have a 30-day return policy - just make sure the product is in original condition. Need help with a return? I can guide you through the process step by step!",
          "I understand returns are important! 🛡️ You have 30 days to return most items in their original condition. What item are you looking to return? I can make the process smooth for you!",
          "No worries about returns! 😊 We offer a hassle-free 30-day return policy. Products should be unused with tags attached. Which item are you concerned about? Let me help you out!"
        ];
        response = returnResponses[Math.floor(Math.random() * returnResponses.length)];
      } else if (userMessage.includes('payment') || userMessage.includes('pay')) {
        const paymentResponses = [
          "Payment options? We've got you covered! 💳 We accept credit/debit cards, UPI, net banking, COD, and popular wallets. All transactions are 100% secure. Which payment method works best for you?",
          "Great question about payments! 💰 We accept pretty much everything - cards, UPI, net banking, COD, and wallets. Your security is our priority! What's your preferred payment method? 🔒",
          "Payment flexibility is key! 💳 Choose from credit/debit cards, UPI, net banking, COD, or wallets. All encrypted and secure. How would you like to pay? 🏦"
        ];
        response = paymentResponses[Math.floor(Math.random() * paymentResponses.length)];
      } else if (userMessage.includes('contact') || userMessage.includes('support') || userMessage.includes('help')) {
        const supportResponses = [
          "I'm here to help right now! 🤝 But if you need to reach our human team, they're available at support@vebstore.com or 1800-VEB-HELP (1800-832-4357). Our support hours are Mon-Sat 9AM-8PM, Sun 10AM-6PM. What specific issue can I help you with?",
          "You've got me to help! 😊 But our human support team is also awesome - reach them at support@vebstore.com or call 1800-VEB-HELP. They're available Mon-Sat 9AM-8PM, Sun 10AM-6PM. What do you need assistance with?",
          "I'm your first point of help! 🌟 For more complex issues, our support team is at support@vebstore.com or 1800-VEB-HELP. Available Mon-Sat 9AM-8PM, Sun 10AM-6PM. How can I assist you right now?"
        ];
        response = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
        const greetingResponses = [
          "Hello! Welcome to VEB Store! 🎉 I'm excited to help you find exactly what you're looking for. What can I assist you with today?",
          "Hi there! 😊 Great to see you at VEB Store! I'm here to make your shopping experience amazing. What's on your shopping list today?",
          "Hey! Welcome! 🛍️ I'm your personal shopping assistant at VEB Store. How can I help you discover something wonderful today?"
        ];
        response = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      } else if (userMessage.includes('thank') || userMessage.includes('thanks')) {
        const thankResponses = [
          "You're very welcome! 😊 It was my pleasure to help you! If you need anything else, I'm right here. Happy shopping at VEB Store! 🛍️",
          "My pleasure! 🌟 Thank you for choosing VEB Store! Remember, I'm here whenever you need assistance. Enjoy your shopping experience!",
          "You're absolutely welcome! 💫 It makes me happy to help! Don't hesitate to ask if you need anything else. Have a wonderful day!"
        ];
        response = thankResponses[Math.floor(Math.random() * thankResponses.length)];
      } else if (userMessage.includes('bye') || userMessage.includes('goodbye') || userMessage.includes('see you')) {
        const farewellResponses = [
          "Thank you for visiting VEB Store! 🌈 It was wonderful helping you today! Have a fantastic day, and we hope to see you again soon! 👋",
          "Goodbye for now! 😊 Thank you for shopping with us! Remember, I'm always here if you need help. Have an amazing day! 🎉",
          "See you soon! 🛍️ It was a pleasure assisting you at VEB Store! Wishing you a wonderful day ahead. Come back anytime! ✨"
        ];
        response = farewellResponses[Math.floor(Math.random() * farewellResponses.length)];
      }

      // Send fallback response as streaming
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const words = response.split(' ');
      words.forEach((word, index) => {
        const chunk = {
          choices: [{
            delta: {
              content: (index > 0 ? ' ' : '') + word
            }
          }]
        };
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      });

      res.write('data: [DONE]\n\n');
      res.end();
    }

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Razorpay payment endpoints
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment order',
      error: error.message 
    });
  }
});

app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YourTestSecretHere')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, update order status
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = 'paid';
        orders[orderIndex].paymentId = razorpay_payment_id;
        orders[orderIndex].paymentMethod = 'razorpay';
      }

      res.json({ 
        success: true,
        message: 'Payment verified successfully',
        orderId: orderId
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment verification failed',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
