import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
const ListProduct = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentName: '',
    productTitle: '',
    price: '',
    imageUrl: '',
    category: '',
    contact: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "You can only upload up to 5 images",
        variant: "destructive"
      });
      return;
    }
    
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Error",
        description: "Please select only valid image files",
        variant: "destructive"
      });
      return;
    }
    
    setImageFiles(validFiles);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${index}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product image",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to list a product",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload images to Supabase storage
      const imageUrls = await uploadImages(imageFiles);
      
      // Get user's university_id from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('university_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to get user profile');
      }

      // Insert product data into marketplace_items table
      const { error: insertError } = await supabase
        .from('marketplace_items')
        .insert({
          title: formData.productTitle,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          contact_phone: formData.contact,
          image_urls: imageUrls,
          user_id: user.id,
          university_id: profile.university_id
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Product listed successfully! It will appear in the marketplace after approval.",
        variant: "default"
      });
      
      // Reset form
      setFormData({
        studentName: '',
        productTitle: '',
        price: '',
        imageUrl: '',
        category: '',
        contact: '',
        description: ''
      });
      setImageFiles([]);
      
    } catch (error) {
      console.error('Error listing product:', error);
      toast({
        title: "Error",
        description: "Failed to list product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">📤 List Your Product</h1>
          <p className="text-gray-600">You've paid ₹50. Now share your product with CU students.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" id="studentName" value={formData.studentName} onChange={handleInputChange} placeholder="Student Name" required className="w-full p-3 border border-gray-300 rounded-md" />
            
            <input type="text" id="productTitle" value={formData.productTitle} onChange={handleInputChange} placeholder="Product Title" required className="w-full p-3 border border-gray-300 rounded-md" />
            
            <input type="number" id="price" value={formData.price} onChange={handleInputChange} placeholder="Price (₹)" required className="w-full p-3 border border-gray-300 rounded-md" />
            
            

            <select id="category" value={formData.category} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-md">
              <option value="" disabled>Select Category</option>
              <option>Books</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Stationery</option>
              <option>Others</option>
            </select>

            <input type="tel" id="contact" value={formData.contact} onChange={handleInputChange} placeholder="Contact Number" required className="w-full p-3 border border-gray-300 rounded-md" />
            
            <textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Short Description" rows={3} required className="w-full p-3 border border-gray-300 rounded-md" />

            <div className="space-y-2">
              <label htmlFor="productImages" className="block text-sm font-medium text-gray-700">
                Product Images * (Up to 5 images)
              </label>
              <input 
                type="file" 
                id="productImages" 
                accept="image/*" 
                multiple
                onChange={handleImageChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">
                    Selected {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export default ListProduct;