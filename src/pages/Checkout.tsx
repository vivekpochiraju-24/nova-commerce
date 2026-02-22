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
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useUserCart();
  const { addOrder } = useOrder();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    setCustomerInfo({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
  }, [user, navigate]);

  // Load Razorpay SDK
  useEffect(() => {
    if (document.getElementById('razorpay-sdk')) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => toast.error('Failed to load payment gateway');
    document.body.appendChild(script);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Pay Online',
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      description: 'UPI, Card, NetBanking via Razorpay'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="w-8 h-8 text-green-600" />,
      description: 'Pay when you receive your order'
    }
  ];

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
      toast.error('Please accept the Terms & Conditions');
      return;
    }

    const totalAmount = Math.round(totalPrice * 1.18);

    if (selectedPayment === 'cod') {
      handleCODOrder(totalAmount);
      return;
    }

    // Razorpay online payment
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Payment gateway is loading, please wait...');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order via edge function
      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: {
          action: 'create-order',
          amount: totalAmount,
          currency: 'INR',
          receipt: `order_${Date.now()}`
        }
      });

      if (error || !data?.order) {
        toast.error(data?.error || 'Failed to create payment order');
        setIsProcessing(false);
        return;
      }

      const { order, key_id } = data;

      // Open Razorpay checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'VEB Store',
        description: `Order of ${items.length} item(s)`,
        order_id: order.id,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: { color: '#7c3aed' },
        handler: async (response: any) => {
          // Verify payment
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay', {
            body: {
              action: 'verify-payment',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          });

          if (verifyError || !verifyData?.verified) {
            toast.error('Payment verification failed. Contact support.');
            setIsProcessing(false);
            return;
          }

          // Payment verified - create order
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
            paymentMethod: 'Razorpay (Online)',
            transactionId: response.razorpay_payment_id,
          };

          const newOrder = addOrder(orderData);
          toast.success(`🎉 Payment successful! Order #${newOrder.id} placed!`);
          clearCart();
          navigate('/order-success', {
            state: {
              orderId: newOrder.id,
              totalAmount,
              paymentMethod: 'Razorpay (Online)',
              transactionId: response.razorpay_payment_id,
            }
          });
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCODOrder = (totalAmount: number) => {
    setIsProcessing(true);
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
      paymentMethod: 'Cash on Delivery',
      transactionId: `COD_${Date.now()}`,
    };

    const newOrder = addOrder(orderData);
    toast.success(`🎉 Order #${newOrder.id} placed successfully!`);
    clearCart();
    setTimeout(() => {
      navigate('/order-success', {
        state: {
          orderId: newOrder.id,
          totalAmount,
          paymentMethod: 'Cash on Delivery',
          transactionId: orderData.transactionId,
        }
      });
    }, 1000);
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
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Customer Info */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Customer Information</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com' },
                    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-2">{field.label} *</label>
                      <input
                        type={field.type}
                        value={customerInfo[field.key as keyof typeof customerInfo]}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, [field.key]: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Delivery Address *</label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
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
                        selectedPayment === method.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        {selectedPayment === method.id && <CheckCircle className="w-5 h-5 text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-28 h-fit">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-6">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
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

                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300">Secure & Encrypted Payment</span>
                </div>

                <NeonButton variant="primary" size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    selectedPayment === 'razorpay' ? 'Pay Now' : 'Place Order'
                  )}
                </NeonButton>

                <div className="mt-4 pt-4 border-t border-border">
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-border text-primary focus:ring-primary"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      I agree to the Terms & Conditions and acknowledge that my order will be processed according to these terms.
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
