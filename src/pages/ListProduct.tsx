
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';

const ListProduct = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    productTitle: '',
    price: '',
    imageUrl: '',
    category: '',
    contact: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('✅ Product listed successfully! It will appear in the marketplace.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">📤 List Your Product</h1>
          <p className="text-gray-600">You've paid ₹50. Now share your product with CU students.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              id="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Student Name" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            
            <input 
              type="text" 
              id="productTitle"
              value={formData.productTitle}
              onChange={handleInputChange}
              placeholder="Product Title" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            
            <input 
              type="number" 
              id="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price (₹)" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            
            <input 
              type="url" 
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            />

            <select 
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Category</option>
              <option>Books</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Stationery</option>
              <option>Others</option>
            </select>

            <input 
              type="tel" 
              id="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Contact Number" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            
            <textarea 
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Short Description" 
              rows={3} 
              required 
              className="w-full p-3 border border-gray-300 rounded-md"
            />

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              Submit Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
