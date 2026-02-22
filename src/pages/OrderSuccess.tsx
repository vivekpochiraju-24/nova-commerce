import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowLeft, Home, Mail, CreditCard, Truck, Shield, Sparkles, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeonButton from '@/components/ui/NeonButton';

interface OrderSuccessState {
  orderId: string;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OrderSuccessState;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!state) {
    navigate('/');
    return null;
  }

  const getPaymentStatusIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'razorpay (online)':
        return <CreditCard className="w-6 h-6 text-green-600" />;
      case 'cash on delivery':
        return <Truck className="w-6 h-6 text-blue-600" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'razorpay (online)':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'cash on delivery':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getEstimatedDelivery = () => {
    const days = state.paymentMethod === 'Cash on Delivery' ? 5 : 3;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/25"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Order Placed Successfully! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              Thank you for your order! We've received your order and will start processing it right away.
            </motion.p>
          </motion.div>

          {/* Order Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Order Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Order Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-semibold text-gray-900">#{state.orderId}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900">{formatPrice(state.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm text-gray-900">{state.transactionId}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-semibold text-gray-900">{getEstimatedDelivery()}</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                {getPaymentStatusIcon(state.paymentMethod)}
                <h2 className="text-xl font-bold text-gray-900">Payment Status</h2>
              </div>
              
              <div className={`p-4 rounded-xl border ${getPaymentStatusColor(state.paymentMethod)} mb-4`}>
                <div className="flex items-center gap-3">
                  {getPaymentStatusIcon(state.paymentMethod)}
                  <div>
                    <p className="font-semibold">{state.paymentMethod}</p>
                    <p className="text-sm opacity-80">
                      {state.paymentMethod === 'Razorpay (Online)' 
                        ? 'Payment completed successfully' 
                        : 'Payment to be made on delivery'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {state.paymentMethod === 'Razorpay (Online)' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Payment verified and secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Transaction protected by Razorpay</span>
                  </div>
                </div>
              )}

              {state.paymentMethod === 'Cash on Delivery' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Truck className="w-4 h-4" />
                    <span>Pay when you receive your order</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Have exact amount ready for smooth delivery</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">What's Next?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Confirmation</h3>
                <p className="text-sm text-gray-600">You'll receive an email with your order details shortly</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">We'll prepare your items for shipment within 24 hours</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Out for Delivery</h3>
                <p className="text-sm text-gray-600">Your order will be delivered on {getEstimatedDelivery()}</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <NeonButton
              onClick={() => navigate('/products')}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </NeonButton>
            
            <button
              onClick={() => navigate('/user-dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Package className="w-5 h-5" />
              View Orders
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
