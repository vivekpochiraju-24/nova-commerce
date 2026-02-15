import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  description: string;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface UserCartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const UserCartContext = createContext<UserCartContextType | undefined>(undefined);

export const useUserCart = () => {
  const context = useContext(UserCartContext);
  if (context === undefined) {
    throw new Error('useUserCart must be used within a UserCartProvider');
  }
  return context;
};

interface UserCartProviderProps {
  children: ReactNode;
}

export const UserCartProvider: React.FC<UserCartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cart data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`vebstore_cart_${user.id}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load cart data:', error);
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } else {
      // Clear cart when user logs out
      setItems([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (user && items.length > 0) {
      localStorage.setItem(`vebstore_cart_${user.id}`, JSON.stringify(items));
    } else if (user) {
      // Clear cart storage when cart is empty
      localStorage.removeItem(`vebstore_cart_${user.id}`);
    }
  }, [items, user]);

  const addToCart = (product: any) => {
    if (!user) {
      toast.error('Please login to add products to cart');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success(`${product.name} quantity updated!`);
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          category: product.category,
          description: product.description,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          inStock: product.inStock,
        };
        toast.success(`${product.name} added to cart!`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      if (item) {
        toast.info(`${item.name} removed from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: UserCartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading,
  };

  return <UserCartContext.Provider value={value}>{children}</UserCartContext.Provider>;
};
