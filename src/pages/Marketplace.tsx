
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

interface Product {
  id: string;
  title: string;
  price: number;
  seller_name: string;
  seller_contact: string;
  description: string;
  image_url?: string;
  category: string;
  created_at: string;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.university_id) {
      fetchProducts();
    }
  }, [profile?.university_id]);

  const fetchProducts = async () => {
    if (!profile?.university_id) return;

    try {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('university_id', profile.university_id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <button
          onClick={() => navigate('/uconnect')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to U Connect
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-foreground">🛒 Marketplace</h1>
          </div>
          <p className="text-muted-foreground">Buy & Sell with 30,000+ Students</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            variant="outline" 
            className="bg-card border-border hover:bg-accent"
          >
            All Categories
          </Button>
          <Button 
            onClick={() => navigate('/list-product')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            List your product (₹50)
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No Products Available</h3>
            <p className="text-muted-foreground">Be the first to list a product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-card-foreground mb-2">{product.title}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">{formatPrice(product.price)}</p>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  
                  <div className="border-t border-border pt-3">
                    <p className="text-sm font-medium text-card-foreground">{product.seller_name}</p>
                    <p className="text-sm text-muted-foreground">{product.seller_contact}</p>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      // Handle contact seller
                      toast({
                        title: "Contact Information",
                        description: `Contact ${product.seller_name} at ${product.seller_contact}`,
                      });
                    }}
                  >
                    Contact Seller
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
