import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, CreditCard } from 'lucide-react';
import NeonButton from './ui/NeonButton';

const Hero: React.FC = () => {
  const features = [
    { icon: Zap, text: 'Fast Delivery' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: Truck, text: 'Free Shipping' },
    { icon: CreditCard, text: 'Easy Returns' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-animated" />
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-neon-pink/20 to-neon-violet/20 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-violet/10 border border-neon-cyan/20"
            >
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-foreground">
                Premium Quality Products
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Welcome to{' '}
              <span className="text-gradient-neon">VEB Store</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Discover premium electronics, accessories, and more at unbeatable prices. 
              Quality products with fast delivery across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <NeonButton variant="primary" size="lg" glowColor="cyan">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </NeonButton>
              </Link>
              <Link to="/products">
                <NeonButton variant="outline" size="lg">
                  View All Products
                </NeonButton>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-neon-violet/10">
                    <feature.icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <motion.div
              className="relative z-10 glass-card p-8 rounded-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Special Offers</h3>
                  <p className="text-muted-foreground">Up to 50% off on selected items</p>
                </div>

                {/* Sample Products */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200',
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
                  ].map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                      className="aspect-square rounded-xl overflow-hidden"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>

                <Link to="/products" className="block">
                  <NeonButton variant="secondary" className="w-full">
                    Explore Deals
                  </NeonButton>
                </Link>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-8 -right-8 p-4 rounded-2xl glass-card"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 5, 0] }}
              transition={{ duration: 1, delay: 1, rotate: { duration: 4, repeat: Infinity } }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                  <p className="font-bold text-neon-cyan">₹500+</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-8 p-4 rounded-2xl glass-card"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, -5, 0] }}
              transition={{ duration: 1, delay: 1.2, rotate: { duration: 4, repeat: Infinity } }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="text-xs text-muted-foreground">Trusted by</p>
                  <p className="font-bold text-neon-violet">10K+ Customers</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
