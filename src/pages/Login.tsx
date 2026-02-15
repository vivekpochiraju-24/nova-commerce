import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, User, Store, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-pink-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">VEB Store</span>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to VEB Store</h1>
          <p className="text-xl text-muted-foreground">Choose your login type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Login Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl border border-blue-500/20 p-8 shadow-2xl shadow-blue-500/10 cursor-pointer hover:shadow-blue-500/20 transition-all duration-300"
          >
            <Link to="/user-login" className="block">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Customer Login</h2>
                <p className="text-muted-foreground">Access your shopping dashboard</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs">🛍️</span>
                  </div>
                  <span>Shop products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <span className="text-xs">📦</span>
                  </div>
                  <span>Track orders</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <span className="text-xs">❤️</span>
                  </div>
                  <span>Manage wishlist</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-500 font-medium">
                Continue as Customer
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>

          {/* Admin Login Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl border border-red-500/20 p-8 shadow-2xl shadow-red-500/10 cursor-pointer hover:shadow-red-500/20 transition-all duration-300"
          >
            <Link to="/admin-login" className="block">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Admin Login</h2>
                <p className="text-muted-foreground">Access admin dashboard</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <span className="text-xs">📊</span>
                  </div>
                  <span>Manage products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <span className="text-xs">👥</span>
                  </div>
                  <span>User management</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <span className="text-xs">📈</span>
                  </div>
                  <span>Analytics & reports</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-red-500 font-medium">
                Continue as Admin
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
