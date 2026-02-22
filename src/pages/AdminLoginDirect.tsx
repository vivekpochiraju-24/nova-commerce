import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Settings, Users, AlertTriangle, Crown, CheckCircle, Key, Server, Database, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const AdminLoginDirect: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email.trim()) {
      newErrors.email = 'Admin email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Admin password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    setIsSuccess(false);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Check if user is admin by checking localStorage or context
        const storedUser = localStorage.getItem('vebstore_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.isAdmin) {
            setIsSuccess(true);
            toast.success('Admin login successful! Redirecting to admin panel...');
            
            // Success animation
            setTimeout(() => {
              navigate('/admin');
            }, 1500);
          } else {
            toast.error('Access denied. Admin privileges required.');
            // Clear the login since user is not admin
            localStorage.removeItem('vebstore_token');
            localStorage.removeItem('vebstore_user');
          }
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Admin login failed';
      toast.error(message);
      setIsSuccess(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100, 
              y: Math.random() * 100,
              scale: 0,
              opacity: 0
            }}
            animate={{
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05,
              scale: [0.8, 1, 0.6][i % 6],
              opacity: [0.1, 0.2, 0.1][i % 6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-red-400/30 to-orange-400/30 blur-xl"
            style={{
              left: `${20 + Math.cos(i * 60)}%`,
              top: `${20 + Math.sin(i * 60)}%`,
              filter: 'blur(8px)',
            }}
          />
        ))}

        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/40 to-yellow-600/20 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-l from-red-600/20 via-orange-600/40 to-yellow-600/20 opacity-30" />
        
        {/* Animated Lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ pathLength: 1, pathOffset: 0 }}
            animate={{ 
              pathLength: 1,
              pathOffset: 100
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '1px',
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-2xl border border-gray-700">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  VEB<span className="text-gradient-neon"> Store</span>
                </h1>
                <p className="text-gray-400 mt-2">Admin Portal</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 shadow-2xl p-8"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Settings className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Admin Access
            </h2>
            <p className="text-gray-400">Enter your administrator credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors text-white placeholder:text-gray-400`}
                  placeholder="admin@vebstore.com"
                />
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute mt-1 text-red-400 text-sm flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors text-white placeholder:text-gray-400`}
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute mt-1 text-red-400 text-sm flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-gray-800"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                Remember admin session
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && !isSuccess && (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-transparent animate-spin rounded-full" />
                    <span>Authenticating...</span>
                  </>
                )}
                {isSuccess && (
                  <>
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Success!</span>
                  </>
                )}
                {!isLoading && !isSuccess && (
                  <>
                    <Shield className="w-5 h-5 text-white" />
                    <span>Admin Sign In</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Success Animation */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="mt-4 text-white">
                  <h3 className="text-xl font-bold">Admin Login Successful!</h3>
                  <p>Redirecting to admin panel...</p>
                </div>
              </motion.div>
            )}
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 border-t border-gray-700 pt-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Demo Credentials</span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="font-medium">Email:</span> admin@vebstore.com</p>
                <p><span className="font-medium">Password:</span> admin123</p>
              </div>
            </div>
          </div>

          {/* Admin Features */}
          <div className="mt-6 border-t border-gray-700 pt-6">
            <p className="text-center text-sm text-gray-400 mb-4">Admin Features</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <Server className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Products</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <Database className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Orders</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Customers</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-600">
                <Activity className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Analytics</span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
              <Shield className="w-4 h-4" />
              Secure Admin Access
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 text-sm text-gray-400">
            <Link to="/" className="hover:text-gray-300">
              ← Back to Home
            </Link>
            <span className="mx-2">•</span>
            <Link to="/user-login" className="hover:text-gray-300">
              Customer Portal
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginDirect;
