import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Crown, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

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
        // The AuthContext now checks roles via the database
        // We need to wait briefly for the user state to update with isAdmin
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
    } catch (error: any) {
      toast.error('Login failed');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-20" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold mb-4">
            <Crown className="w-4 h-4" />ADMIN ACCESS
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <motion.div initial={{ rotate: -180 }} animate={{ rotate: 0 }} transition={{ delay: 0.3, type: "spring" }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 mb-4 shadow-lg shadow-red-500/50">
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-300">Access VEB Store Admin Dashboard</p>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Restricted Access</span>
            </div>
            <p className="text-xs text-gray-300">This area is restricted to authorized administrators only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 backdrop-blur-sm ${errors.email ? 'border-red-500' : 'border-white/20'} focus:border-blue-500 focus:bg-white/20 outline-none transition-all duration-300`} placeholder="admin@vebstore.com" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required className={`w-full pl-11 pr-12 py-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 backdrop-blur-sm ${errors.password ? 'border-red-500' : 'border-white/20'} focus:border-blue-500 focus:bg-white/20 outline-none transition-all duration-300`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{errors.password}</p>}
            </div>

            <motion.button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25">
              {isLoading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Authenticating...</>) : (<><Shield className="w-5 h-5" />Access Admin Panel<ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
            {['Encrypted Connection', 'Two-Factor Authentication Ready', 'Session Timeout Protection'].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-300"><CheckCircle className="w-3 h-3 text-green-400" /><span>{f}</span></div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">Not an admin?{' '}<Link to="/user-login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">User Login</Link></p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
