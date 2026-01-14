import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Truck, HeartHandshake, RotateCcw, Award } from 'lucide-react';
import GlassCard from './ui/GlassCard';

const Features: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹500. Fast and reliable shipping across India.',
      color: 'from-neon-cyan to-neon-violet',
    },
    {
      icon: Zap,
      title: 'Quick Checkout',
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
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '7-day hassle-free return policy on all products.',
      color: 'from-neon-pink to-neon-violet',
    },
    {
      icon: HeartHandshake,
      title: '24/7 Support',
      description: 'Get help from our support team anytime via chat, email, or phone.',
      color: 'from-neon-cyan to-neon-green',
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: '100% genuine products with manufacturer warranty.',
      color: 'from-neon-violet to-neon-cyan',
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient-neon">VEB Store</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with quality products and excellent service.
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
