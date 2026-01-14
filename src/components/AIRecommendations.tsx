import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import NeonButton from './ui/NeonButton';

const AIRecommendations: React.FC = () => {
  const recommendedProducts = [
    {
      id: '1',
      name: 'Premium Wireless Earbuds Pro',
      price: 149,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      rating: 4.8,
      reviews: 2847,
      aiRecommended: true,
    },
    {
      id: '2',
      name: 'Smart Watch Series X',
      price: 399,
      originalPrice: 499,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
      rating: 4.9,
      reviews: 3521,
      aiRecommended: true,
      isTrending: true,
    },
    {
      id: '3',
      name: 'Ultra-Slim Laptop Stand',
      price: 79,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      rating: 4.7,
      reviews: 1234,
      aiRecommended: true,
    },
    {
      id: '4',
      name: 'Mechanical Gaming Keyboard',
      price: 189,
      originalPrice: 229,
      image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
      rating: 4.6,
      reviews: 987,
      aiRecommended: true,
      isNew: true,
    },
  ];

  const insights = [
    { icon: Brain, label: 'Based on browsing', value: '12 products analyzed' },
    { icon: TrendingUp, label: 'Match accuracy', value: '94% confidence' },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-violet/10 border border-neon-cyan/20 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-neon-cyan" />
            </motion.div>
            <span className="text-sm font-medium text-foreground">AI-Powered</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Curated <span className="text-gradient-neon">Just for You</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes your preferences, browsing history, and purchase patterns to recommend 
            products you'll love.
          </p>

          {/* AI Insights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border"
              >
                <insight.icon className="w-5 h-5 text-neon-cyan" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">{insight.label}</p>
                  <p className="text-sm font-semibold text-foreground">{insight.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.1} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <NeonButton variant="outline" size="lg">
            View All Recommendations
            <ChevronRight className="w-5 h-5" />
          </NeonButton>
        </motion.div>
      </div>
    </section>
  );
};

export default AIRecommendations;
