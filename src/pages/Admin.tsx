import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Plus, Edit2, Trash2, Search, Store, LogOut, Menu, X,
  TrendingUp, DollarSign, Eye, Calendar, Mail, Phone, Settings,
  AlertCircle, CheckCircle, Clock, ArrowUp, ArrowDown, MoreVertical,
  Download, Filter, RefreshCw, Bell, User, Shield, Activity, Target,
  Zap, Award, Star, MessageSquare, FileText, Database, Cpu, HardDrive,
  Wifi, Battery, Thermometer, Wind, Droplets, Sun, Moon, Cloud,
  Key, ArrowRight
} from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/data/products';
import { categories } from '@/data/products';
import NeonButton from '@/components/ui/NeonButton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings' | 'reports';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrder();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const { user, allUsers, logout } = useAuth();

  // Protect admin route
  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);

  // Form state for new/edit product
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    description: '',
    image: '',
    inStock: true,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    { 
      label: 'Total Revenue', 
      value: formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0)), 
      change: '+12.5%', 
      icon: DollarSign,
      color: 'from-neon-green to-neon-cyan',
      trend: 'up',
      detail: 'vs last month'
    },
    { 
      label: 'Total Orders', 
      value: orders.length.toString(), 
      change: '+8.2%', 
      icon: ShoppingCart,
      color: 'from-neon-cyan to-neon-violet',
      trend: 'up',
      detail: 'this week'
    },
    { 
      label: 'Total Products', 
      value: products.length.toString(), 
      change: '+3', 
      icon: Package,
      color: 'from-neon-violet to-neon-pink',
      trend: 'up',
      detail: 'new additions'
    },
    { 
      label: 'Total Customers', 
      value: allUsers.filter(u => !u.isAdmin).length.toString(), 
      change: '+15.3%', 
      icon: Users,
      color: 'from-neon-pink to-neon-violet',
      trend: 'up',
      detail: 'active users'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.2%', 
      change: '+0.8%', 
      icon: Target,
      color: 'from-orange-500 to-red-500',
      trend: 'up',
      detail: 'avg conversion'
    },
    { 
      label: 'Avg Order Value', 
      value: formatPrice(orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0), 
      change: '+5.4%', 
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
      trend: 'up',
      detail: 'per order'
    }
  ];

  const recentOrders = orders.slice(0, 5);

  // Enhanced customer data with order information
  const allCustomers = allUsers.filter(u => !u.isAdmin).map(user => {
    const customerOrders = orders.filter(order => order.customerEmail === user.email);
    return {
      ...user,
      orders: customerOrders.length,
      spent: customerOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      lastOrder: customerOrders.length > 0 ? Math.max(...customerOrders.map(o => new Date(o.orderDate).getTime())) : null
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: 'Electronics',
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      inStock: true,
    });
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
      toast.success('Product deleted successfully');
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
      image: formData.image,
      inStock: formData.inStock,
      rating: editingProduct?.rating || 4.5,
      reviews: editingProduct?.reviews || 0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully');
    } else {
      addProduct(productData);
      toast.success('Product added successfully');
    }

    setIsModalOpen(false);
  };

  const sidebarItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart },
    { id: 'customers' as Tab, label: 'Customers', icon: Users },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'reports' as Tab, label: 'Reports', icon: FileText },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-neon-green/20 text-neon-green';
      case 'Shipped': return 'bg-neon-cyan/20 text-neon-cyan';
      case 'Processing': return 'bg-neon-violet/20 text-neon-violet';
      default: return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-primary text-primary-foreground z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">VEB Admin</span>
          </Link>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
              Back to Store
            </button>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-foreground capitalize">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-secondary relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary">
                <RefreshCw className="w-5 h-5" />
              </button>
              <Link to="/">
                <NeonButton variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                  View Store
                </NeonButton>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.customerName}</td>
                          <td className="py-3 px-4">{formatPrice(order.totalAmount)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{order.orderDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2.5 pl-11 rounded-xl bg-card border border-border focus:border-primary outline-none text-foreground"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <NeonButton variant="primary" onClick={handleAddProduct}>
                  <Plus className="w-4 h-4" />
                  Add Product
                </NeonButton>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-secondary/30">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <span className="font-medium line-clamp-1">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                          <td className="py-4 px-4 font-medium">{formatPrice(product.price)}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.inStock 
                                ? 'bg-neon-green/20 text-neon-green' 
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">All Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">{formatPrice(order.totalAmount)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{order.orderDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Customers */}
          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">Customer List</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact Info</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orders</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Spent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCustomers.map((customer, index) => (
                      <tr key={customer.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {customer.id}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                            {customer.address && (
                              <div className="text-sm text-muted-foreground max-w-xs truncate">
                                {customer.address}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-center">
                            <div className="font-medium">{customer.orders}</div>
                            {customer.lastOrder && (
                              <div className="text-xs text-muted-foreground">
                                Last: {new Date(customer.lastOrder).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{formatPrice(customer.spent)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(customer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Sales Overview</h3>
                  <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-xl">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Sales chart visualization</p>
                      <p className="text-sm text-muted-foreground">Integration with chart library needed</p>
                    </div>
                  </div>
                </div>

                {/* Customer Analytics */}
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Customer Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New Customers (This Month)</span>
                      <span className="font-bold text-foreground">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Returning Customers</span>
                      <span className="font-bold text-foreground">89</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Customer Retention Rate</span>
                      <span className="font-bold text-green-500">78.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Customer Lifetime Value</span>
                      <span className="font-bold text-foreground">{formatPrice(12500)}</span>
                    </div>
                  </div>
                </div>

                {/* Product Performance */}
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Product Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Top Selling Product</span>
                      <span className="font-bold text-foreground">Laptop Pro</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Low Stock Items</span>
                      <span className="font-bold text-orange-500">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Category Performance</span>
                      <span className="font-bold text-foreground">Electronics</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Products with Reviews</span>
                      <span className="font-bold text-foreground">45/67</span>
                    </div>
                  </div>
                </div>

                {/* Order Analytics */}
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Order Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Orders Today</span>
                      <span className="font-bold text-foreground">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Orders</span>
                      <span className="font-bold text-yellow-500">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Processing Time</span>
                      <span className="font-bold text-foreground">2.5 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Order Completion Rate</span>
                      <span className="font-bold text-green-500">94.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reports */}
          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Reports & Exports</h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Download className="w-4 h-4" />
                    Export All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Sales Report', desc: 'Monthly sales analysis', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
                    { title: 'Inventory Report', desc: 'Stock levels and movements', icon: Package, color: 'from-blue-500 to-cyan-500' },
                    { title: 'Customer Report', desc: 'Customer demographics and behavior', icon: Users, color: 'from-purple-500 to-pink-500' },
                    { title: 'Order Report', desc: 'Order history and status', icon: ShoppingCart, color: 'from-orange-500 to-red-500' },
                    { title: 'Product Performance', desc: 'Best and worst performing products', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
                    { title: 'Financial Summary', desc: 'Revenue and expense summary', icon: FileText, color: 'from-yellow-500 to-orange-500' },
                  ].map((report, index) => (
                    <motion.div
                      key={report.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl border border-border hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-3`}>
                        <report.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{report.desc}</p>
                      <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Download className="w-3 h-3" />
                        Generate Report
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-6">Admin Settings</h2>
                
                <div className="space-y-6">
                  {/* Store Settings */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Store Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Store Name</p>
                          <p className="text-sm text-muted-foreground">VEB Store</p>
                        </div>
                        <button className="text-sm text-primary hover:underline">Edit</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Store Email</p>
                          <p className="text-sm text-muted-foreground">admin@vebstore.com</p>
                        </div>
                        <button className="text-sm text-primary hover:underline">Edit</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Currency</p>
                          <p className="text-sm text-muted-foreground">Indian Rupee (₹)</p>
                        </div>
                        <button className="text-sm text-primary hover:underline">Change</button>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'New Order Notifications', enabled: true },
                        { label: 'Low Stock Alerts', enabled: true },
                        { label: 'Customer Registration', enabled: false },
                        { label: 'System Updates', enabled: true },
                      ].map((setting, index) => (
                        <div key={setting.label} className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{setting.label}</span>
                          <button
                            className={`w-12 h-6 rounded-full transition-colors ${
                              setting.enabled ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Security</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-foreground">Two-Factor Authentication</span>
                        </div>
                        <span className="text-sm text-green-500">Enabled</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-foreground">Change Admin Password</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-card rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none"
                    placeholder="999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none"
                    placeholder="1299"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none"
                >
                  {categories.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none resize-none"
                  rows={3}
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-primary outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="inStock" className="text-sm font-medium">In Stock</label>
              </div>

              <div className="flex gap-3 pt-4">
                <NeonButton variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </NeonButton>
                <NeonButton variant="primary" className="flex-1" onClick={handleSaveProduct}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </NeonButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
