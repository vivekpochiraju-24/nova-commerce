import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import NeonButton from './ui/NeonButton';

const Hero: React.FC = () => {
  const features = [
    { icon: Sparkles, text: 'AI-Powered Recommendations' },
    { icon: Zap, text: 'Lightning Fast Checkout' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: Truck, text: 'Free Express Shipping' },
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
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-foreground">
                AI-Powered Shopping Experience
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Shop Smarter with{' '}
              <span className="text-gradient-neon">AI-Driven</span>{' '}
              Recommendations
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Experience the future of e-commerce. Our intelligent platform learns your preferences 
              and curates the perfect products just for you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <NeonButton variant="primary" size="lg" glowColor="cyan">
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </NeonButton>
              <NeonButton variant="outline" size="lg">
                Explore AI Features
              </NeonButton>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">AI Assistant</p>
                      <p className="font-semibold text-foreground">Finding perfect products...</p>
                    </div>
                  </div>
                  <motion.div
                    className="w-3 h-3 rounded-full bg-neon-green"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing preferences</span>
                    <span className="text-neon-cyan">87%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"
                      initial={{ width: 0 }}
                      animate={{ width: '87%' }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Sample Products */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                      className="aspect-square rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20" />
                    </motion.div>
                  ))}
                </div>
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
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-xs text-muted-foreground">Match Rate</p>
                  <p className="font-bold text-neon-cyan">98%</p>
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
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="font-bold text-neon-violet">0.3s</p>
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
