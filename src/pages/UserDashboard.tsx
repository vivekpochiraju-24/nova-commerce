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
  BarChart3,
  X,
  Minus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'sonner';
import axios from 'axios';
import { apiConfig } from '@/utils/apiConfig';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
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
  const { orders, getOrdersByCustomer } = useOrder();
  const navigate = useNavigate();
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddItems, setShowAddItems] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/user-login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  // Refresh data when user logs in
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user?.email]);

  const fetchUserData = async () => {
    try {
      // Small delay to ensure OrderContext is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get user orders from OrderContext
      const userOrders = user ? getOrdersByCustomer(user.email) : [];
      
      // Fetch available products
      const API_URL = apiConfig.getApiUrl();
      const productsResponse = await axios.get(`${API_URL}/api/products`);
      setAvailableProducts(productsResponse.data || []);

      // Calculate stats only if orders exist
      if (userOrders.length > 0) {
        const totalSpent = userOrders.reduce((sum: number, order: Order) => 
          order.status !== 'cancelled' ? sum + order.totalAmount : sum, 0
        );
        const pendingOrders = userOrders.filter((order: Order) => 
          order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing'
        ).length;

        // Fetch wishlist items
        const wishlistResponse = await axios.get(`${API_URL}/api/wishlist`);
        const wishlistItems = wishlistResponse.data || [];
        setWishlist(wishlistItems);

        // Calculate additional stats
        const savedMoney = userOrders.reduce((sum: number, order: Order) => {
          // Calculate saved money from discounts (mock calculation)
          return sum + (order.totalAmount * 0.1); // Assume 10% savings on average
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
      } else {
        // Set default stats if no orders
        setStats({
          totalOrders: 0,
          totalSpent: 0,
          wishlistItems: 0,
          pendingOrders: 0,
          savedMoney: 0,
          loyaltyPoints: 0
        });
      }
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

  const handleAddItemsToOrder = async (orderId: string) => {
    try {
      if (selectedProducts.length === 0) {
        toast.error('Please select at least one product');
        return;
      }

      const additionalAmount = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const API_URL = apiConfig.getApiUrl();
      const response = await axios.put(`${API_URL}/api/orders/${orderId}`, {
        items: selectedProducts,
        additionalAmount
      });

      if (response.data.message) {
        toast.success(response.data.message);
        // Refresh orders
        fetchUserData();
        // Reset form
        setSelectedProducts([]);
        setShowAddItems(false);
        setSelectedOrder(null);
      }
    } catch (error: any) {
      console.error('Error adding items to order:', error);
      toast.error(error.response?.data?.message || 'Failed to add items to order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const API_URL = apiConfig.getApiUrl();
      const response = await axios.delete(`${API_URL}/api/orders/${orderId}`);
      
      if (response.data.message) {
        toast.success(response.data.message);
        // Refresh orders
        fetchUserData();
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleProductSelect = (product: any) => {
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      // Update quantity
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
    } else {
      // Add new product
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleProductRemove(productId);
      return;
    }
    
    const updatedProducts = selectedProducts.map(p => 
      p.id === productId ? { ...p, quantity } : p
    );
    setSelectedProducts(updatedProducts);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'processing': return 'text-blue-500 bg-blue-500/10';
      case 'shipped': return 'text-purple-500 bg-purple-500/10';
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
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
    return order.status.toLowerCase() === filterStatus;
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
                    <div key={order.id} className="border border-border rounded-xl p-4 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2">Order Items:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <img src={item.image || 'https://via.placeholder.com/48x48'} alt={item.name} className="w-12 h-12 rounded object-cover" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                              </div>
                              <p className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {(order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing') && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAddItems(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Items
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Cancel Order
                          </button>
                        </div>
                      )}
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

      {/* Add Items Modal */}
      {showAddItems && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-border p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                Add Items to Order #{selectedOrder.id}
              </h3>
              <button
                onClick={() => {
                  setShowAddItems(false);
                  setSelectedOrder(null);
                  setSelectedProducts([]);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Available Products */}
            <div className="mb-6">
              <h4 className="font-medium text-foreground mb-4">Available Products</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {availableProducts.map((product) => {
                  const isSelected = selectedProducts.some(p => p.id === product.id);
                  const selectedProduct = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-border hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-foreground">{product.name}</h5>
                          <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                          <p className="text-xs text-green-600">In Stock</p>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProductQuantity(product.id, (selectedProduct?.quantity || 1) - 1);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {selectedProduct?.quantity || 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProductQuantity(product.id, (selectedProduct?.quantity || 1) + 1);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Items Summary */}
            {selectedProducts.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-4">Selected Items</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(product.price * product.quantity).toLocaleString()}</p>
                        <button
                          onClick={() => handleProductRemove(product.id)}
                          className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total and Action Buttons */}
            {selectedProducts.length > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-foreground">
                    Additional Total: ₹{selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedProducts([]);
                      setShowAddItems(false);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddItemsToOrder(selectedOrder.id)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
