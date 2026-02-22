import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Store, LogOut } from 'lucide-react';
import { useUserCart } from '@/context/UserCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import NeonButton from './ui/NeonButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems: cartItems } = useUserCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/products' },
    { name: 'Deals', href: '/products' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card rounded-none border-x-0 border-t-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <span className="text-xl font-bold text-foreground">
                  VEB<span className="text-gradient-neon"> Store</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.name} to={item.href}>
                  <motion.span
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors relative group"
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet group-hover:w-full transition-all duration-300" />
                  </motion.span>
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2.5 pl-11 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5 text-foreground" />
              </motion.button>

              {/* Wishlist */}
              <Link to="/wishlist">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="hidden sm:flex p-2 rounded-xl hover:bg-secondary transition-colors relative"
                >
                  <Heart className="w-5 h-5 text-foreground" />
                  {wishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center">
                      {wishlistItems}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5 text-foreground" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet text-white text-xs font-bold flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center gap-2">
                  {user.isAdmin ? (
                    <Link to="/admin" className="hidden sm:block">
                      <NeonButton variant="primary" size="sm">
                        <User className="w-4 h-4" />
                        Admin
                      </NeonButton>
                    </Link>
                  ) : (
                    <Link to="/user-dashboard" className="hidden sm:block">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Dashboard</span>
                      </motion.div>
                    </Link>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </motion.button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <NeonButton variant="primary" size="sm">
                    <User className="w-4 h-4" />
                    Login
                  </NeonButton>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-4 glass-card rounded-none border-x-0"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-11 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all text-foreground"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 glass-card rounded-none border-x-0 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium">
                    <Heart className="w-4 h-4" /> Wishlist ({wishlistItems})
                  </div>
                </Link>
                {user ? (
                  <>
                    {user.isAdmin ? (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <NeonButton variant="primary" className="w-full">
                          <User className="w-4 h-4" />
                          Admin Dashboard
                        </NeonButton>
                      </Link>
                    ) : (
                      <Link to="/user-dashboard" onClick={() => setIsMenuOpen(false)}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors font-medium"
                        >
                          <User className="w-4 h-4" />
                          User Dashboard
                        </motion.div>
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout ({user.name})
                    </motion.button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <NeonButton variant="primary" className="w-full">
                      <User className="w-4 h-4" />
                      Login / Register
                    </NeonButton>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
