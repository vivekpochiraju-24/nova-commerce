import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowLeft, Home, Mail } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              🎉 Order Placed Successfully!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Thank you for shopping with VEB Store! Your order has been confirmed.
            </motion.p>

            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-2xl p-6 mb-8 text-left"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Order Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-semibold text-foreground">#{state.orderId}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold text-foreground">{state.paymentMethod}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-sm font-semibold text-foreground">{state.transactionId}</span>
                </div>
                
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(state.totalAmount)}</span>
                </div>
              </div>
            </motion.div>

            {/* Email Confirmation Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Order confirmation email sent
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Check your inbox for order details and tracking information
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <NeonButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/products')}
                className="flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Continue Shopping
              </NeonButton>
              
              <NeonButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </NeonButton>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-sm text-muted-foreground"
            >
              <p>Questions about your order?</p>
              <p>Contact us at <span className="text-primary font-medium">support@vebstore.in</span> or call +91 98765 43210</p>
              <p>Located in Hyderabad, India</p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
