import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, products as fallbackProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const mapDbProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  image: p.image,
  rating: Number(p.rating),
  reviews: p.reviews,
  category: p.category,
  description: p.description,
  inStock: p.in_stock,
  isNew: p.is_new ?? false,
  isTrending: p.is_trending ?? false,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setProducts(data.map(mapDbProduct));
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase.from('products').insert({
        name: productData.name,
        price: productData.price,
        original_price: productData.originalPrice || null,
        category: productData.category,
        description: productData.description,
        image: productData.image,
        in_stock: productData.inStock,
        rating: productData.rating || 4.5,
        reviews: productData.reviews || 0,
        is_new: productData.isNew || false,
        is_trending: productData.isTrending || false,
      }).select().single();
      
      if (error) throw error;
      if (data) {
        setProducts(prev => [mapDbProduct(data), ...prev]);
        toast.success('Product added successfully');
      }
    } catch (err: any) {
      console.error('Failed to add product:', err);
      toast.error('Failed to add product: ' + err.message);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updateData: any = {};
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice;
      if (productData.category !== undefined) updateData.category = productData.category;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.image !== undefined) updateData.image = productData.image;
      if (productData.inStock !== undefined) updateData.in_stock = productData.inStock;

      const { error } = await supabase.from('products').update(updateData).eq('id', id);
      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
      toast.success('Product updated successfully');
    } catch (err: any) {
      console.error('Failed to update product:', err);
      toast.error('Failed to update product: ' + err.message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error('Failed to delete product: ' + err.message);
    }
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within a ProductProvider');
  return context;
};
