import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Store, Edit3, Settings, ShoppingBag, Heart, Package, UserCircle, HelpCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const UserLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 1000);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-pink-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/90 backdrop-blur-lg rounded-3xl border border-blue-500/20 p-8 shadow-2xl shadow-blue-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Store className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">VEB Store</span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Customer Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your customer account</p>
          </div>

          {/* Features */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-xs text-blue-500">🛍️</span>
              </div>
              <span className="text-xs text-muted-foreground">Shop</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xs text-purple-500">📦</span>
              </div>
              <span className="text-xs text-muted-foreground">Orders</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
              <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-pink-500/20 flex items-center justify-center">
                <span className="text-xs text-pink-500">❤️</span>
              </div>
              <span className="text-xs text-muted-foreground">Wishlist</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border ${
                    errors.email ? 'border-blue-500' : 'border-border'
                  } focus:border-blue-500 outline-none transition-colors`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-blue-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-11 pr-12 py-3 rounded-xl bg-secondary border ${
                    errors.password ? 'border-blue-500' : 'border-border'
                  } focus:border-blue-500 outline-none transition-colors`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-blue-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Signing In...'
              ) : (
                <>
                  Sign In to Shop
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Additional Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link 
                to="/products"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Link>
              <Link 
                to="/wishlist"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
              >
                <Heart className="w-4 h-4" />
                View Wishlist
              </Link>
            </div>

            {/* Quick Access Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Link 
                to="/orders"
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600">Orders</span>
              </Link>
              <Link 
                to="/profile"
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <UserCircle className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-600">Profile</span>
              </Link>
              <Link 
                to="/help"
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-600">Help</span>
              </Link>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">
                Create Account
              </Link>
            </p>
          </div>

          {/* Utility Buttons */}
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Link 
                to="/forgot-password"
                className="flex-1 text-center py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Forgot Password?
              </Link>
              <Link 
                to="/guest-checkout"
                className="flex-1 text-center py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Guest Checkout
              </Link>
            </div>
            <Link 
              to="/track-order"
              className="w-full text-center py-2 px-4 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Track Order Without Login
            </Link>
          </div>

          {/* Admin Access Link */}
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">
              Are you an admin?{' '}
              <Link to="/admin-login" className="text-blue-500 hover:underline font-medium">
                Admin Portal
              </Link>
            </p>
          </div>

          {/* Profile Quick Actions */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Quick Profile Access</h3>
              <Settings className="w-4 h-4 text-blue-500" />
            </div>
            <div className="space-y-2">
              <Link 
                to="/user-dashboard"
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-blue-500/20 hover:bg-blue-50 transition-colors"
              >
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-foreground">View Dashboard</span>
                <ArrowRight className="w-3 h-3 text-blue-500 ml-auto" />
              </Link>
              <Link 
                to="/profile-edit"
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-purple-500/20 hover:bg-purple-50 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-foreground">Edit Profile</span>
                <ArrowRight className="w-3 h-3 text-purple-500 ml-auto" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
