import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import NeonButton from './ui/NeonButton';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = products.filter(p => p.isTrending || p.isNew).slice(0, 4);

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
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-foreground">Featured Products</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Best Sellers & <span className="text-gradient-neon">New Arrivals</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular products loved by customers across India
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
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
          <Link to="/products">
            <NeonButton variant="outline" size="lg">
              View All Products
              <ChevronRight className="w-5 h-5" />
            </NeonButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
