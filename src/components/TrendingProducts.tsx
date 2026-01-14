import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const TrendingProducts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  const trendingProducts = [
    {
      id: '5',
      name: 'Noise Cancelling Headphones',
      price: 299,
      originalPrice: 349,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      rating: 4.9,
      reviews: 5621,
      isTrending: true,
    },
    {
      id: '6',
      name: 'Portable Power Bank 20000mAh',
      price: 59,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      rating: 4.7,
      reviews: 3245,
      isTrending: true,
      isNew: true,
    },
    {
      id: '7',
      name: 'Smart Home Hub Controller',
      price: 179,
      originalPrice: 229,
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
      rating: 4.6,
      reviews: 1876,
      isTrending: true,
    },
    {
      id: '8',
      name: 'Wireless Charging Pad',
      price: 49,
      image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400',
      rating: 4.5,
      reviews: 2134,
      isTrending: true,
    },
    {
      id: '9',
      name: 'USB-C Hub Multiport Adapter',
      price: 89,
      originalPrice: 119,
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400',
      rating: 4.8,
      reviews: 1543,
      isTrending: true,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, trendingProducts.length - 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, trendingProducts.length - 4) : prev - 1
    );
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-pink/10 to-neon-violet/10 border border-neon-pink/20 mb-4">
              <Flame className="w-4 h-4 text-neon-pink" />
              <span className="text-sm font-medium text-foreground">Hot Right Now</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              <span className="text-gradient-neon">Trending</span> Products
            </h2>
            <p className="text-muted-foreground">
              Most popular items our customers are loving this week
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="p-3 rounded-xl bg-card border border-border hover:border-neon-cyan hover:shadow-neon-cyan transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="p-3 rounded-xl bg-card border border-border hover:border-neon-cyan hover:shadow-neon-cyan transition-all"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </motion.div>

        {/* Trending Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Products Sold', value: '12.5K+', change: '+23%' },
            { label: 'Happy Customers', value: '8.2K+', change: '+18%' },
            { label: 'Countries Shipped', value: '45+', change: '+5' },
            { label: 'Avg. Rating', value: '4.8', change: '+0.2' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-neon-green font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Products Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: -currentIndex * (300 + 24) }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {trendingProducts.map((product, index) => (
              <div key={product.id} className="min-w-[280px] md:min-w-[300px]">
                <ProductCard product={product} delay={index * 0.1} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, trendingProducts.length - 3) }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'w-8 bg-gradient-to-r from-neon-cyan to-neon-violet'
                  : 'w-2 bg-border hover:bg-muted-foreground'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
