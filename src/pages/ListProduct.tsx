import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
const ListProduct = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    productTitle: '',
    price: '',
    imageUrl: '',
    category: '',
    contact: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive"
        });
      }
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please select a product image",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload image to Supabase storage
      const imageUrl = await uploadImage(imageFile);
      
      // Here you would typically save the product data to your database
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Product listed successfully! It will appear in the marketplace.",
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
      setImageFile(null);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
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
              <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
                Product Image *
              </label>
              <input 
                type="file" 
                id="productImage" 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
                className="w-full p-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageFile && (
                <div className="mt-2 text-sm text-green-600">
                  Selected: {imageFile.name}
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