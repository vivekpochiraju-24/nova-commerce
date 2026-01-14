import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Truck, HeartHandshake, BarChart3 } from 'lucide-react';
import GlassCard from './ui/GlassCard';

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Our intelligent system learns your preferences to suggest products you\'ll love.',
      color: 'from-neon-cyan to-neon-violet',
    },
    {
      icon: Zap,
      title: 'Instant Checkout',
      description: 'Complete your purchase in seconds with our streamlined checkout process.',
      color: 'from-neon-violet to-neon-pink',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Bank-level encryption protects your transactions and personal data.',
      color: 'from-neon-green to-neon-cyan',
    },
    {
      icon: Truck,
      title: 'Express Delivery',
      description: 'Free shipping on orders over $50 with real-time tracking.',
      color: 'from-neon-pink to-neon-violet',
    },
    {
      icon: HeartHandshake,
      title: '24/7 AI Support',
      description: 'Get instant help from our AI assistant anytime, anywhere.',
      color: 'from-neon-cyan to-neon-green',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Track your orders, spending habits, and discover new savings.',
      color: 'from-neon-violet to-neon-cyan',
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient-neon">SmartCommerce</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of online shopping with cutting-edge features 
            designed to make your life easier.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard key={feature.title} delay={index * 0.1} className="p-6">
              <div className="space-y-4">
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 inline-flex`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-full h-full text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
