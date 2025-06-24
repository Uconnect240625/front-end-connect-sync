
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';

const PostNotice = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
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
    alert('✅ Notice submitted successfully! (Backend coming soon)');
    setFormData({ title: '', type: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <h2 className="text-center text-2xl font-bold text-red-600 mb-6">Post a New Notice</h2>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-semibold mb-2">Notice Title</label>
              <input 
                type="text" 
                id="title" 
                value={formData.title}
                onChange={handleInputChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="type" className="block font-semibold mb-2">Notice Type</label>
              <select 
                id="type" 
                value={formData.type}
                onChange={handleInputChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select Type</option>
                <option value="Official">Official</option>
                <option value="Clubs">Clubs</option>
                <option value="Hostel">Hostel</option>
                <option value="Academics">Academics</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block font-semibold mb-2">Draft a Notice</label>
              <textarea 
                id="description" 
                value={formData.description}
                onChange={handleInputChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-md h-32"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Submit Notice
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostNotice;
