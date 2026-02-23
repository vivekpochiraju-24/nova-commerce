import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Store, ShoppingBag, Heart, Package, LogIn, Sparkles, Gift, Star, Zap, AlertTriangle } from 'lucide-react';
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
    const newErrors = { email: '', password: '' };
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/user-dashboard');
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
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full blur-3xl opacity-20" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            CUSTOMER PORTAL
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.3 }} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <motion.div initial={{ rotate: -180 }} animate={{ rotate: 0 }} transition={{ delay: 0.3, duration: 0.5, type: "spring" }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4 shadow-lg shadow-blue-500/50">
              <Store className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your customer account</p>
          </div>

          {/* Features */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            {[{ icon: ShoppingBag, label: 'Shop', color: 'blue' }, { icon: Package, label: 'Orders', color: 'purple' }, { icon: Heart, label: 'Wishlist', color: 'pink' }].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`text-center p-2 rounded-xl bg-${color}-500/20 border border-${color}-500/30`}>
                <div className={`w-8 h-8 mx-auto mb-1 rounded-full bg-${color}-500/30 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${color}-400`} />
                </div>
                <span className="text-xs text-gray-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Member Benefits</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /><span>Rewards Points</span></div>
              <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400" /><span>Exclusive Deals</span></div>
              <div className="flex items-center gap-1"><Package className="w-3 h-3 text-purple-400" /><span>Fast Delivery</span></div>
              <div className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400" /><span>Wishlist</span></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 backdrop-blur-sm ${errors.email ? 'border-red-500' : 'border-white/20'} focus:border-blue-500 focus:bg-white/20 outline-none transition-all duration-300`} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required className={`w-full pl-11 pr-12 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-white/20'} focus:border-blue-500 focus:bg-white/20 outline-none transition-all duration-300`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.password}</p>}
            </div>

            <motion.button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Signing In...</>
              ) : (
                <><LogIn className="w-5 h-5" />Sign In to Shop<ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">Don't have an account?{' '}<Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Create Account</Link></p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-300">Are you an admin?{' '}<Link to="/admin-login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Admin Portal</Link></p>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">© 2024 VEB Store. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
