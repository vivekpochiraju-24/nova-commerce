import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserCart } from '@/context/UserCartContext';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import NeonButton from '@/components/ui/NeonButton';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useUserCart();
  const { addOrder } = useOrder();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    
    // Pre-fill customer info with logged-in user data
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">P</div>,
      description: 'Pay securely with PayPal'
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      description: 'Pay with RuPay, Visa, Mastercard'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="w-8 h-8 text-green-600" />,
      description: 'Pay when you receive your order'
    }
  ];

  const generateOrderId = () => {
    return 'VEB' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const sendOrderConfirmationEmail = async (orderData: any) => {
    try {
      const response = await fetch('http://localhost:3001/api/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const processPayment = async (paymentMethod: string, amount: number, retryAttempt = 0) => {
    try {
      const response = await fetch('http://localhost:3001/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod, amount }),
      });

      if (!response.ok) {
        throw new Error(`Payment server error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Retry logic for network errors
      if (retryAttempt < 2 && error.message.includes('Failed to fetch')) {
        console.log(`Retrying payment attempt ${retryAttempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return processPayment(paymentMethod, amount, retryAttempt + 1);
      }
      
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch')) {
        return { success: false, message: 'Payment service is unavailable after multiple attempts. Please try again later.' };
      } else if (error.message.includes('Payment server error')) {
        return { success: false, message: 'Payment server error. Please try again.' };
      } else {
        return { success: false, message: 'Payment processing failed. Please check your details and try again.' };
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all customer information');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the Terms & Conditions to place your order');
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = Math.round(totalPrice * 1.18);
      const orderId = generateOrderId();

      // Process payment
      const paymentResult = await processPayment(selectedPayment, totalAmount);

      if (!paymentResult.success) {
        toast.error(paymentResult.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        setRetryCount(prev => prev + 1);
        return;
      }
      
      // Reset retry count on successful payment
      setRetryCount(0);

      // Add order to context
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        totalAmount,
        paymentMethod: paymentMethods.find(m => m.id === selectedPayment)?.name || '',
        transactionId: paymentResult.transactionId
      };

      const newOrder = addOrder(orderData);

      // Send order confirmation email
      const emailData = {
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        orderDetails: {
          orderId: newOrder.id,
          paymentMethod: orderData.paymentMethod,
          items: orderData.items
        },
        totalAmount
      };

      await sendOrderConfirmationEmail(emailData);

      // Show success message
      toast.success(`🎉 Congratulations! Your order #${newOrder.id} has been placed successfully!`);

      // Clear cart and redirect to success page
      clearCart();
      
      setTimeout(() => {
        navigate('/order-success', { 
          state: { 
            orderId: newOrder.id, 
            totalAmount, 
            paymentMethod: orderData.paymentMethod,
            transactionId: paymentResult.transactionId
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('Order processing error:', error);
      toast.error('An error occurred while processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="123 Main Street, City, State - 123456"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {selectedPayment === method.id && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-28 h-fit"
            >
              <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-neon-green">Free</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (18%)</span>
                    <span>{formatPrice(totalPrice * 0.18)}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-xl font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice * 1.18)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Secure & Encrypted Payment
                  </span>
                </div>

                <NeonButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Processing...'}
                    </>
                  ) : (
                    'Place Order'
                  )}
                </NeonButton>
                
                {retryCount > 0 && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                      <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                        Payment retry attempt {retryCount} of 3
                      </p>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Please wait while we retry the payment...
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-border">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-border text-primary focus:ring-primary"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      I agree to the <button 
                        type="button" 
                        onClick={() => window.open('/terms', '_blank')}
                        className="text-primary hover:underline underline-offset-2"
                      >
                        Terms & Conditions
                      </button> and acknowledge that my order will be processed according to these terms.
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
