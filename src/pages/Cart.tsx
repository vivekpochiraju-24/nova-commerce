import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserCart } from '@/context/UserCartContext';
import { useAuth } from '@/context/AuthContext';
import NeonButton from '@/components/ui/NeonButton';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useUserCart();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your cart');
      navigate('/login');
    }
  }, [user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-8"
          >
            Shopping Cart
          </motion.h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <p className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</p>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products">
                <NeonButton variant="primary" size="lg">
                  Start Shopping
                </NeonButton>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.id}`}>
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.category}
                      </p>
                      <p className="text-lg font-bold text-foreground mt-2">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.info('Item removed from cart');
                          }}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Clear Cart */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      clearCart();
                      toast.info('Cart cleared');
                    }}
                    className="text-destructive hover:underline text-sm"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

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
                      <span>Tax</span>
                      <span>{formatPrice(totalPrice * 0.18)}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between text-xl font-bold text-foreground">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice * 1.18)}</span>
                    </div>
                  </div>

                  <NeonButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </NeonButton>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by VEB Store
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
