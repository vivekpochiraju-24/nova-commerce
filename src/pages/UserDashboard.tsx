import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Package, 
  LogOut, 
  Settings, 
  MapPin, 
  Phone, 
  Mail,
  CreditCard,
  TrendingUp,
  Clock,
  Truck,
  Star,
  ArrowRight,
  Edit3,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Award,
  Target,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  date: string;
  items: number;
  products?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  addedDate: string;
  inStock: boolean;
  discount?: number;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  pendingOrders: number;
  savedMoney: number;
  loyaltyPoints: number;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    pendingOrders: 0,
    savedMoney: 0,
    loyaltyPoints: 0
  });
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    preferences: {
      notifications: true,
      newsletter: false,
      theme: 'light'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'profile' | 'analytics'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/user-login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user orders
      const ordersResponse = await axios.get('http://localhost:3001/api/orders/user');
      const userOrders = ordersResponse.data || [];
      setOrders(userOrders.slice(0, 5)); // Show recent 5 orders

      // Calculate stats
      const totalSpent = userOrders.reduce((sum: number, order: Order) => 
        order.status !== 'cancelled' ? sum + order.total : sum, 0
      );
      const pendingOrders = userOrders.filter((order: Order) => 
        order.status === 'pending' || order.status === 'processing'
      ).length;

      // Fetch wishlist items
      const wishlistResponse = await axios.get('http://localhost:3001/api/wishlist');
      const wishlistItems = wishlistResponse.data || [];
      setWishlist(wishlistItems);

      // Calculate additional stats
      const savedMoney = userOrders.reduce((sum: number, order: Order) => {
        // Calculate saved money from discounts (mock calculation)
        return sum + (order.total * 0.1); // Assume 10% savings on average
      }, 0);
      const loyaltyPoints = Math.floor(totalSpent / 10); // 1 point per ₹10 spent

      setStats({
        totalOrders: userOrders.length,
        totalSpent,
        wishlistItems: wishlistItems.length,
        pendingOrders,
        savedMoney,
        loyaltyPoints
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Set default values if API fails
      setStats({
        totalOrders: 0,
        totalSpent: 0,
        wishlistItems: 0,
        pendingOrders: 0,
        savedMoney: 0,
        loyaltyPoints: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'processing': return 'text-blue-500 bg-blue-500/10';
      case 'shipped': return 'text-purple-500 bg-purple-500/10';
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Star className="w-4 h-4" />;
      case 'cancelled': return <CreditCard className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      // Mock API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      // Mock API call to remove from wishlist
      setWishlist(prev => prev.filter(item => item.id !== itemId));
      setStats(prev => ({ ...prev, wishlistItems: prev.wishlistItems - 1 }));
      toast.success('Item removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      // Mock API call to add to cart
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const filteredWishlist = wishlist.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">VEB Store</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/products" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Manage your orders, wishlist, and account settings from your personal dashboard.
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalOrders}</h3>
            <p className="text-muted-foreground">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">₹{stats.totalSpent.toLocaleString()}</h3>
            <p className="text-muted-foreground">Total Spent</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.wishlistItems}</h3>
            <p className="text-muted-foreground">Wishlist Items</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.pendingOrders}</h3>
            <p className="text-muted-foreground">Pending Orders</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                <Link 
                  to="/orders" 
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">₹{order.total.toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Link 
                    to="/products"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/products"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-foreground">Shop Now</span>
                </Link>
                <Link 
                  to="/wishlist"
                  className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
                >
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-medium text-foreground">My Wishlist</span>
                </Link>
                <Link 
                  to="/cart"
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-foreground">View Cart</span>
                </Link>
                <Link 
                  to="/settings"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-foreground">Account Settings</span>
                </Link>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium text-foreground">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
