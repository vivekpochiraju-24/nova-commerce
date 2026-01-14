import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Sparkles } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isTrending?: boolean;
  aiRecommended?: boolean;
}

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <GlassCard delay={delay} className="p-0 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-muted">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-neon-cyan to-neon-violet rounded-full">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-neon-pink to-neon-violet rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> TRENDING
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 text-xs font-bold text-white bg-destructive rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* AI Recommended Badge */}
        {product.aiRecommended && (
          <div className="absolute top-3 right-3">
            <motion.div
              className="p-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-medium hover:bg-white transition-colors"
          >
            <Heart className="w-5 h-5 text-foreground hover:text-destructive transition-colors" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-medium hover:bg-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-gradient-neon transition-all duration-300">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <NeonButton variant="primary" size="sm" className="w-full">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </NeonButton>
      </div>
    </GlassCard>
  );
};

export default ProductCard;
