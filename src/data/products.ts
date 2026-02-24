export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Leather Oxford Shoes',
    price: 5999,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
    rating: 4.8,
    reviews: 1247,
    category: 'Shoes',
    description: 'Handcrafted premium leather oxford shoes with cushioned insole and durable outsole.',
    inStock: true,
    isTrending: true,
  },
  {
    id: '2',
    name: 'Chronograph Luxury Watch',
    price: 14999,
    originalPrice: 22999,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    rating: 4.9,
    reviews: 2521,
    category: 'Watches',
    description: 'Stainless steel chronograph watch with sapphire crystal glass and leather strap.',
    inStock: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: '3',
    name: 'Running Sport Sneakers',
    price: 3499,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 4.7,
    reviews: 3234,
    category: 'Shoes',
    description: 'Lightweight breathable running shoes with responsive cushioning and grip sole.',
    inStock: true,
    isNew: true,
  },
  {
    id: '4',
    name: 'Smart Fitness Watch Pro',
    price: 12999,
    originalPrice: 18999,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
    rating: 4.8,
    reviews: 1987,
    category: 'Watches',
    description: 'Advanced smartwatch with heart rate monitor, GPS, SpO2 sensor and 7-day battery.',
    inStock: true,
    isTrending: true,
  },
  {
    id: '5',
    name: 'Premium Suede Chelsea Boots',
    price: 7499,
    originalPrice: 10999,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400',
    rating: 4.6,
    reviews: 876,
    category: 'Shoes',
    description: 'Italian suede chelsea boots with elastic side panel and memory foam insole.',
    inStock: true,
  },
  {
    id: '6',
    name: 'Minimalist Analog Watch',
    price: 4999,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    rating: 4.7,
    reviews: 1543,
    category: 'Watches',
    description: 'Ultra-thin minimalist watch with Japanese quartz movement and mesh strap.',
    inStock: true,
    isNew: true,
  },
  {
    id: '7',
    name: 'High-Top Basketball Shoes',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400',
    rating: 4.5,
    reviews: 2134,
    category: 'Shoes',
    description: 'Professional basketball shoes with ankle support, air cushion and anti-slip sole.',
    inStock: true,
    isTrending: true,
  },
  {
    id: '8',
    name: 'Diver Automatic Watch',
    price: 19999,
    originalPrice: 29999,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400',
    rating: 4.9,
    reviews: 921,
    category: 'Watches',
    description: 'Professional diver watch, 200m water resistant with automatic movement and rotating bezel.',
    inStock: true,
  },
  {
    id: '9',
    name: 'Canvas Casual Sneakers',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    rating: 4.4,
    reviews: 4521,
    category: 'Shoes',
    description: 'Classic canvas sneakers with vulcanized rubber sole, perfect for everyday wear.',
    inStock: true,
  },
  {
    id: '10',
    name: 'Rose Gold Fashion Watch',
    price: 8999,
    originalPrice: 13999,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
    rating: 4.8,
    reviews: 1876,
    category: 'Watches',
    description: 'Elegant rose gold watch with crystal-studded bezel and genuine leather band.',
    inStock: true,
    isTrending: true,
  },
];

export const categories = [
  'All',
  'Shoes',
  'Watches',
];
