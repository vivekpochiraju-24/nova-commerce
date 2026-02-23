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
import RazorpayPayment from '@/components/RazorpayPayment';
import { toast } from 'sonner';
import axios from 'axios';
import { apiConfig } from '@/utils/apiConfig';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useUserCart();
  const { addOrder } = useOrder();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showRazorpay, setShowRazorpay] = useState(false);
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

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Verify payment on backend
      const API_URL = apiConfig.getApiUrl();
      const verifyResponse = await axios.post(`${API_URL}/api/razorpay/verify-payment`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: response.orderId
      });

      if (verifyResponse.data.success) {
        // Create order after successful payment
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
          totalAmount: response.amount,
          paymentMethod: 'Razorpay (Online)',
          transactionId: response.razorpay_payment_id,
        };

        const newOrder = addOrder(orderData);
        toast.success(`🎉 Payment successful! Order #${newOrder.id} placed!`);
        clearCart();
        navigate('/order-success', {
          state: {
            orderId: newOrder.id,
            totalAmount: response.amount,
            paymentMethod: 'Razorpay (Online)',
            transactionId: response.razorpay_payment_id,
          }
        });
      } else {
        toast.error('Payment verification failed. Contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed. Contact support.');
    } finally {
      setIsProcessing(false);
      setShowRazorpay(false);
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    toast.error(error.message || 'Payment failed. Please try again.');
    setIsProcessing(false);
    setShowRazorpay(false);
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
    setShowRazorpay(false);
    toast.info('Payment cancelled');
  };

  const handleCODOrder = async (totalAmount: number) => {
    setIsProcessing(true);
    try {
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
        transactionId: 'COD_' + Date.now(),
      };

      const newOrder = addOrder(orderData);
      toast.success(`🎉 Order placed successfully! Order #${newOrder.id}`);
      clearCart();
      navigate('/order-success', {
        state: {
          orderId: newOrder.id,
          totalAmount,
          paymentMethod: 'Cash on Delivery',
          transactionId: orderData.transactionId,
        }
      });
    } catch (error) {
      console.error('COD order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
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
      toast.error('Please accept the Terms & Conditions');
      return;
    }

    const totalAmount = Math.round(totalPrice * 1.18);

    if (selectedPayment === 'cod') {
      handleCODOrder(totalAmount);
      return;
    }

    // Razorpay online payment
    setIsProcessing(true);
    setShowRazorpay(true);
  };

  const totalAmount = Math.round(totalPrice * 1.18);
  const orderId = 'order_' + Date.now();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <NeonButton onClick={() => navigate('/products')}>
              Continue Shopping
            </NeonButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-6">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Address</label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary outline-none transition-colors resize-none"
                      rows={3}
                      placeholder="123 Main St, City, State - 123456"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          selectedPayment === method.id
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedPayment === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm"
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    I agree to the Terms & Conditions and understand that my order will be processed according to the selected payment method.
                  </span>
                </label>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24"
              >
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes (18%)</span>
                    <span>{formatPrice(totalPrice * 0.18)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Razorpay Payment Component */}
                {showRazorpay && (
                  <div className="mt-6">
                    <RazorpayPayment
                      amount={totalAmount}
                      orderId={orderId}
                      customerInfo={customerInfo}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      onClose={handlePaymentClose}
                    />
                  </div>
                )}

                {/* Place Order Button */}
                {!showRazorpay && (
                  <NeonButton
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !selectedPayment}
                    className="w-full mt-6"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </NeonButton>
                )}
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-border p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Secure Payment Powered by Razorpay</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
