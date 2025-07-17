import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ShoppingCart, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Navigation from '@/components/Navigation';
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image_urls?: string[];
  category: string;
  created_at: string;
  contact_phone?: string;
  user_id: string;
}
const Marketplace = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    profile
  } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [showMyListings, setShowMyListings] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  useEffect(() => {
    if (profile?.university_id) {
      fetchProducts();
    }
  }, [profile?.university_id, showMyListings]);
  const fetchProducts = async () => {
    if (!profile?.university_id) return;
    try {
      let query = supabase
        .from('marketplace_items')
        .select('*')
        .eq('university_id', profile.university_id)
        .eq('approval_status', 'approved');
      
      if (showMyListings) {
        query = query.eq('user_id', profile.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
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

  const deleteProduct = async (productId: string) => {
    try {
      // First, get the product to access its image URLs
      const { data: product, error: fetchError } = await supabase
        .from('marketplace_items')
        .select('image_urls')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      // Delete images from storage if they exist
      if (product?.image_urls && product.image_urls.length > 0) {
        for (const imageUrl of product.image_urls) {
          // Extract the file path from the URL
          const urlParts = imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          
          if (fileName) {
            await supabase.storage
              .from('product-images')
              .remove([fileName]);
          }
        }
      }

      // Delete the product from database
      const { error } = await supabase
        .from('marketplace_items')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product and images deleted successfully"
      });
      
      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const navigateImage = (productId: string, direction: 'prev' | 'next', imageCount: number) => {
    setCurrentImageIndex(prev => {
      const current = prev[productId] || 0;
      let newIndex;
      if (direction === 'prev') {
        newIndex = current === 0 ? imageCount - 1 : current - 1;
      } else {
        newIndex = current === imageCount - 1 ? 0 : current + 1;
      }
      return { ...prev, [productId]: newIndex };
    });
  };
  const categories = ['All Categories', 'Books', 'Electronics', 'Clothing', 'Stationery', 'Others'];
  
  const filteredProducts = selectedCategory === 'All Categories' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <button onClick={() => navigate('/uconnect')} className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft size={20} />
          Back to U Connect
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            
            <h1 className="font-bold text-foreground text-2xl">🛒 Marketplace</h1>
          </div>
          <p className="text-muted-foreground">Buy & Sell with 1,000+ Students</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {categories.map(category => (
            <Button 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"} 
              className={selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-card border-border hover:bg-accent"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant={showMyListings ? "default" : "outline"}
            onClick={() => setShowMyListings(!showMyListings)}
            className="mb-0"
          >
            {showMyListings ? "All Products" : "My Listings"}
          </Button>
          <Button onClick={() => navigate('/list-product')} className="bg-blue-600 hover:bg-blue-700 text-white">
            List your product (₹50)
          </Button>
        </div>

        {filteredProducts.length === 0 ? <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No Products Available</h3>
            <p className="text-muted-foreground">{showMyListings ? "You haven't listed any products yet!" : "Be the first to list a product!"}</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => <div key={product.id} className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow">
                {product.image_urls && product.image_urls.length > 0 && (
                  <div className="relative">
                    <img 
                      src={product.image_urls[currentImageIndex[product.id] || 0]} 
                      alt={product.title} 
                      className="w-full h-48 object-cover" 
                    />
                    
                    {product.image_urls.length > 1 && (
                      <>
                        <button
                          onClick={() => navigateImage(product.id, 'prev', product.image_urls.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => navigateImage(product.id, 'next', product.image_urls.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                        
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {product.image_urls.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === (currentImageIndex[product.id] || 0) ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-card-foreground">{product.title}</h3>
                    {(product.user_id === profile?.id || profile?.role === 'admin') && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this product? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(product.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  
                  <p className="text-2xl font-bold text-green-600 mb-2">{formatPrice(product.price)}</p>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  
                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground">{product.contact_phone || 'Contact via app'}</p>
                  </div>
                  
                  {product.user_id !== profile?.id && (
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                      toast({
                        title: "Contact Information",
                        description: `Contact seller at ${product.contact_phone || 'Contact via app'}`
                      });
                    }}>
                      Contact Seller
                    </Button>
                  )}
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
};
export default Marketplace;