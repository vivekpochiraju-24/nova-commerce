import React, { useState, useEffect } from 'react';
import { loadScript } from '../utils/loadScript';
import { apiConfig } from '@/utils/apiConfig';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
  onClose: () => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  orderId,
  customerInfo,
  onSuccess,
  onFailure,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = async () => {
      try {
        await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        setIsScriptLoaded(true);
      } catch (error) {
        console.error('Failed to load Razorpay script:', error);
        onFailure({ message: 'Failed to load payment gateway' });
      }
    };

    loadRazorpayScript();
  }, [onFailure]);

  const initializePayment = async () => {
    if (!isScriptLoaded || !window.Razorpay) {
      onFailure({ message: 'Payment gateway not loaded' });
      return;
    }

    setIsLoading(true);

    try {
      // Create order on backend
      const API_URL = apiConfig.getApiUrl();
      const response = await fetch(`${API_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: orderId,
          notes: {
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone
          }
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const options = {
        key: 'rzp_test_YourTestKeyHere', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'VEB Store',
        description: `Order #${orderId}`,
        image: '/logo.png', // Add your logo
        order_id: orderData.id,
        handler: function (response: any) {
          // Payment successful
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId,
            amount: amount,
          });
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: 'VEB Store Headquarters',
          order_id: orderId,
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: function () {
            onClose();
          },
          escape: true,
          handleback: true,
          confirm_close: true,
          animation: 'slideIn',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // Handle payment failure
      rzp.on('payment.failed', function (response: any) {
        onFailure({
          error: response.error.description,
          code: response.error.code,
          orderId: orderId,
        });
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={initializePayment}
        disabled={isLoading || !isScriptLoaded}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            Pay with Razorpay
          </>
        )}
      </button>
      
      {!isScriptLoaded && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Loading payment gateway...
        </p>
      )}
    </div>
  );
};

export default RazorpayPayment;
