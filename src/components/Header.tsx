import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, Sparkles } from 'lucide-react';
import NeonButton from './ui/NeonButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'AI Picks', href: '/ai-picks', icon: Sparkles },
    { name: 'Deals', href: '/deals' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card rounded-none border-x-0 border-t-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet opacity-50 blur-lg"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                Smart<span className="text-gradient-neon">Commerce</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-neon-cyan" />}
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search with AI..."
                  className="w-full px-4 py-2.5 pl-11 rounded-xl bg-secondary/50 border border-border focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="px-2 py-0.5 text-xs font-medium text-neon-cyan bg-neon-cyan/10 rounded-md">
                    AI
                  </span>
                </div>
              </div>
            </div>

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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex p-2 rounded-xl hover:bg-secondary transition-colors relative"
              >
                <Heart className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-neon-pink to-neon-violet text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl hover:bg-secondary transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet text-white text-xs font-bold flex items-center justify-center">
                  5
                </span>
              </motion.button>

              {/* User / Sign In */}
              <NeonButton variant="primary" size="sm" className="hidden sm:flex">
                <User className="w-4 h-4" />
                Sign In
              </NeonButton>

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
            <div className="relative">
              <input
                type="text"
                placeholder="Search with AI..."
                className="w-full px-4 py-3 pl-11 rounded-xl bg-secondary/50 border border-border focus:border-neon-cyan outline-none transition-all text-foreground"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
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
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  {item.icon && <item.icon className="w-4 h-4 text-neon-cyan" />}
                  {item.name}
                </motion.a>
              ))}
              <div className="pt-4 border-t border-border">
                <NeonButton variant="primary" className="w-full">
                  <User className="w-4 h-4" />
                  Sign In
                </NeonButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
