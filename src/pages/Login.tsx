import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, ShoppingBag, Heart, Package, Truck, Star, ChevronRight, Store, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-12">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    VEB<span className="text-gradient-neon"> Store</span>
                  </h1>
                  <p className="text-gray-600 mt-2">Your Premium Shopping Destination</p>
                </div>
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Portal
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Select your login type to access your personalized shopping experience
              </p>
            </motion.div>

            {/* Login Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="group"
              >
                <Link to="/user-login">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Portal</h3>
                        <p className="text-gray-600">Shop, track orders, and manage your account</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-blue-600 mb-2">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        <span className="font-medium">Continue as Customer</span>
                      </div>
                      <p className="text-sm text-gray-600">Access your shopping cart, wishlist, and order history</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">Customer Login</span>
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Admin Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="group"
              >
                <Link to="/admin-login">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h3>
                        <p className="text-gray-600">Manage products, orders, and customers</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600 mb-2">
                        <Package className="w-5 h-5 mr-2" />
                        <span className="font-medium">Continue as Admin</span>
                      </div>
                      <p className="text-sm text-gray-600">Access admin dashboard and management tools</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Admin Login</span>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up now
                </Link>
              </p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Fast Delivery</h4>
                <p className="text-sm text-gray-600">Quick shipping on all orders</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">Best Prices</h4>
                <p className="text-sm text-gray-600">Great deals every day</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900">Premium Support</h4>
                <p className="text-sm text-gray-600">24/7 customer service</p>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up now
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/" className="text-blue-600 hover:text-blue-500">
                ← Back to Home
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
