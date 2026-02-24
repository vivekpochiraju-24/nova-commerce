import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Plus, Edit2, Trash2, Search, Store, LogOut, Menu, X,
  TrendingUp, DollarSign, Eye, Calendar, Mail,
  CheckCircle, Clock, ArrowUp, Bell, Shield, 
  Activity, Watch, Footprints, ChevronDown
} from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/data/products';
import { categories } from '@/data/products';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type Tab = 'dashboard' | 'products' | 'orders' | 'customers';

interface DbOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: DbOrderItem[];
  profile?: { full_name: string | null; email: string; };
}

interface DbOrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_image: string | null;
}

interface DbProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface DbSession {
  id: string;
  user_id: string;
  login_at: string;
  last_seen_at: string;
  is_active: boolean;
  user_agent: string | null;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);
  const [dbProfiles, setDbProfiles] = useState<DbProfile[]>([]);
  const [dbSessions, setDbSessions] = useState<DbSession[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderStatusUpdate, setOrderStatusUpdate] = useState<{ id: string; status: string } | null>(null);
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch real data from database
  useEffect(() => {
    if (user?.isAdmin) {
      fetchOrders();
      fetchProfiles();
      fetchSessions();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) { console.error('Orders fetch error:', error); return; }

    // Fetch items and profiles for each order
    const enriched = await Promise.all((orders || []).map(async (order) => {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', order.user_id)
        .single();

      return { ...order, items: items || [], profile: profile || undefined };
    }));

    setDbOrders(enriched);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setDbProfiles(data);
  };

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('login_at', { ascending: false })
      .limit(50);
    if (!error && data) setDbSessions(data);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order status');
      return;
    }
    toast.success(`Order status updated to ${newStatus}`);
    setOrderStatusUpdate(null);
    fetchOrders();
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Shoes',
    description: '',
    image: '',
    inStock: true,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const totalRevenue = dbOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrders = dbOrders.filter(o => o.status === 'pending').length;
  const deliveredOrders = dbOrders.filter(o => o.status === 'delivered').length;
  const activeSessions = dbSessions.filter(s => s.is_active).length;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', originalPrice: '', category: 'Shoes', description: '', image: '', inStock: true });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      description: product.description,
      image: product.image,
      inStock: product.inStock,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    const productData = {
      name: formData.name,
      price: parseInt(formData.price),
      originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
      category: formData.category,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      inStock: formData.inStock,
      rating: editingProduct?.rating || 4.5,
      reviews: editingProduct?.reviews || 0,
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const sidebarItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart },
    { id: 'customers' as Tab, label: 'Customers', icon: Users },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
      processing: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
      shipped: 'bg-violet-500/15 text-violet-600 border-violet-500/30',
      delivered: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
      cancelled: 'bg-red-500/15 text-red-600 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerOrders = (userId: string) => dbOrders.filter(o => o.user_id === userId);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-foreground z-50 transform transition-transform duration-300 flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center shadow-neon-cyan">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-tight">VEB Admin</span>
              <span className="text-xs text-white/50">Shoes & Watches</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 text-white border border-neon-cyan/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'orders' && pendingOrders > 0 && (
                <span className="ml-auto text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">{pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Eye className="w-5 h-5" />
            <span>View Store</span>
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground capitalize">{activeTab}</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">{activeSessions} active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, gradient: 'from-emerald-500 to-teal-500', change: `${dbOrders.length} orders` },
                  { label: 'Total Orders', value: dbOrders.length.toString(), icon: ShoppingCart, gradient: 'from-blue-500 to-indigo-500', change: `${pendingOrders} pending` },
                  { label: 'Products', value: products.length.toString(), icon: Package, gradient: 'from-violet-500 to-purple-500', change: `${products.filter(p => p.category === 'Shoes').length} shoes, ${products.filter(p => p.category === 'Watches').length} watches` },
                  { label: 'Customers', value: dbProfiles.length.toString(), icon: Users, gradient: 'from-orange-500 to-pink-500', change: `${activeSessions} online now` },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 group hover:shadow-medium transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders + Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Recent Orders</h2>
                  <div className="space-y-3">
                    {dbOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{order.profile?.full_name || order.profile?.email || 'Customer'}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground text-sm">{formatPrice(Number(order.total_amount))}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dbOrders.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No orders yet</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-6 text-primary-foreground">
                    <div className="flex items-center gap-2 mb-4">
                      <Footprints className="w-5 h-5" />
                      <Watch className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Shoes & Watches</h3>
                    <p className="text-sm text-primary-foreground/70 mb-4">Your exclusive product categories</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{products.filter(p => p.category === 'Shoes').length}</p>
                        <p className="text-xs text-primary-foreground/70">Shoes</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">{products.filter(p => p.category === 'Watches').length}</p>
                        <p className="text-xs text-primary-foreground/70">Watches</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-card border border-border p-6">
                    <h3 className="font-semibold text-foreground mb-3">Recent Logins</h3>
                    <div className="space-y-2">
                      {dbSessions.slice(0, 4).map(session => {
                        const profile = dbProfiles.find(p => p.user_id === session.user_id);
                        return (
                          <div key={session.id} className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${session.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                            <span className="text-foreground truncate flex-1">{profile?.full_name || profile?.email || 'User'}</span>
                            <span className="text-xs text-muted-foreground">{new Date(session.login_at).toLocaleDateString()}</span>
                          </div>
                        );
                      })}
                      {dbSessions.length === 0 && <p className="text-sm text-muted-foreground">No sessions</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== PRODUCTS ===== */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shoes, watches..."
                    className="w-full px-4 py-2.5 pl-11 rounded-xl bg-card border border-border focus:border-primary outline-none text-foreground"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <button onClick={handleAddProduct} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-primary-foreground font-medium hover:bg-foreground/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl bg-card border border-border overflow-hidden group hover:shadow-medium transition-shadow"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.category === 'Shoes' ? 'bg-blue-500/90 text-white' : 'bg-amber-500/90 text-white'
                        }`}>
                          {product.category === 'Shoes' ? <Footprints className="w-3 h-3 inline mr-1" /> : <Watch className="w-3 h-3 inline mr-1" />}
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          product.inStock ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                        }`}>{product.inStock ? 'IN STOCK' : 'OUT'}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through ml-2">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleEditProduct(product)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== ORDERS ===== */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setSearchQuery(status === 'all' ? '' : status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      (searchQuery === '' && status === 'all') || searchQuery === status
                        ? 'bg-foreground text-primary-foreground border-foreground'
                        : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {dbOrders
                  .filter(o => !searchQuery || o.status === searchQuery)
                  .map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className="rounded-2xl bg-card border border-border overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.profile?.full_name || order.profile?.email || 'Customer'}</p>
                          <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-foreground">{formatPrice(Number(order.total_amount))}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border overflow-hidden"
                        >
                          <div className="p-4 space-y-4">
                            {/* Items */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2">Items Ordered</h4>
                              <div className="space-y-2">
                                {order.items?.map(item => (
                                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                                    {item.product_image && (
                                      <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{formatPrice(Number(item.price) * item.quantity)}</p>
                                  </div>
                                ))}
                                {(!order.items || order.items.length === 0) && (
                                  <p className="text-sm text-muted-foreground">No items found</p>
                                )}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {order.phone && (
                                <div>
                                  <span className="text-muted-foreground">Phone: </span>
                                  <span className="text-foreground">{order.phone}</span>
                                </div>
                              )}
                              {order.shipping_address && (
                                <div>
                                  <span className="text-muted-foreground">Address: </span>
                                  <span className="text-foreground">{order.shipping_address}</span>
                                </div>
                              )}
                            </div>

                            {/* Status Update */}
                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                              <span className="text-sm text-muted-foreground">Update Status:</span>
                              {['pending', 'processing', 'shipped', 'delivered'].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateOrderStatus(order.id, status)}
                                  disabled={order.status === status}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    order.status === status
                                      ? 'bg-foreground text-primary-foreground'
                                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                {dbOrders.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== CUSTOMERS ===== */}
          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-card border border-border p-5">
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">{dbProfiles.length}</p>
                </div>
                <div className="rounded-2xl bg-card border border-border p-5">
                  <p className="text-sm text-muted-foreground mb-1">Active Sessions</p>
                  <p className="text-3xl font-bold text-emerald-600">{activeSessions}</p>
                </div>
                <div className="rounded-2xl bg-card border border-border p-5">
                  <p className="text-sm text-muted-foreground mb-1">Total Logins</p>
                  <p className="text-3xl font-bold text-foreground">{dbSessions.length}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">All Users</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orders</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Spent</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbProfiles.map((profile) => {
                        const userOrders = getCustomerOrders(profile.user_id);
                        const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
                        const isOnline = dbSessions.some(s => s.user_id === profile.user_id && s.is_active);
                        return (
                          <tr key={profile.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center text-white text-sm font-bold">
                                  {(profile.full_name || profile.email)[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-foreground">{profile.full_name || 'User'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                {profile.email}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(profile.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-foreground">{userOrders.length}</td>
                            <td className="py-3 px-4 text-sm font-medium text-foreground">{formatPrice(totalSpent)}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                isOnline ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted text-muted-foreground'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                {isOnline ? 'Online' : 'Offline'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {dbProfiles.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No users registered yet</p>
                  </div>
                )}
              </div>

              {/* Recent Login Activity */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Login Activity</h2>
                <div className="space-y-2">
                  {dbSessions.slice(0, 10).map(session => {
                    const profile = dbProfiles.find(p => p.user_id === session.user_id);
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${session.is_active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                          <div>
                            <p className="text-sm font-medium text-foreground">{profile?.full_name || profile?.email || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{session.user_agent?.slice(0, 40) || 'Browser session'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{new Date(session.login_at).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">Last seen: {new Date(session.last_seen_at).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Product Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground" placeholder="Enter product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price (₹) *</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground" placeholder="999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Original Price (₹)</label>
                    <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground" placeholder="1299" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground">
                    <option value="Shoes">👟 Shoes</option>
                    <option value="Watches">⌚ Watches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground resize-none" rows={3} placeholder="Enter product description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground" placeholder="https://..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="inStock" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4 rounded" />
                  <label htmlFor="inStock" className="text-sm font-medium text-foreground">In Stock</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary transition-colors font-medium">
                    Cancel
                  </button>
                  <button onClick={handleSaveProduct} className="flex-1 px-4 py-2.5 rounded-xl bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors font-medium">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
