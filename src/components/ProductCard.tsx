import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { useUserCart } from '@/context/UserCartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { addToCart } = useUserCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add products to wishlist');
      navigate('/login');
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <GlassCard delay={delay} className="p-0 overflow-hidden h-full">
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
              <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-neon-pink to-neon-violet rounded-full">
                🔥 TRENDING
              </span>
            )}
            {discount > 0 && (
              <span className="px-3 py-1 text-xs font-bold text-white bg-destructive rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full backdrop-blur-sm shadow-medium transition-colors ${
                inWishlist ? 'bg-destructive text-white' : 'bg-white/90 hover:bg-white text-foreground'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-medium hover:bg-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>

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
            <span className="text-xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <NeonButton variant="primary" size="sm" className="w-full" onClick={() => handleAddToCart({} as React.MouseEvent)}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </NeonButton>
        </div>
      </GlassCard>
    </Link>
  );
};

export default ProductCard;
