
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';

const PostRoommateRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    gender: '',
    budget: '',
    location: '',
    contact: '',
    note: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('✅ Roommate request submitted! It will be reviewed by admin.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-lg mx-auto pt-20 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
            Post Roommate Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-semibold mb-2">Your Name</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg" 
                required 
              />
            </div>

            <div>
              <label htmlFor="year" className="block font-semibold mb-2">Year</label>
              <select 
                id="year" 
                value={formData.year}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg" 
                required
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            <div>
              <label htmlFor="gender" className="block font-semibold mb-2">Gender</label>
              <select 
                id="gender" 
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg" 
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="block font-semibold mb-2">Budget (₹/month)</label>
              <input 
                type="number" 
                id="budget" 
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., 6000"
                className="w-full p-3 border border-gray-300 rounded-lg" 
                required 
              />
            </div>

            <div>
              <label htmlFor="location" className="block font-semibold mb-2">Preferred Location</label>
              <input 
                type="text" 
                id="location" 
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Near Gate 1"
                className="w-full p-3 border border-gray-300 rounded-lg" 
                required 
              />
            </div>

            <div>
              <label htmlFor="contact" className="block font-semibold mb-2">Contact Number</label>
              <input 
                type="tel" 
                id="contact" 
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="+91 XXXXXXXXXX"
                className="w-full p-3 border border-gray-300 rounded-lg" 
                required 
              />
            </div>

            <div>
              <label htmlFor="note" className="block font-semibold mb-2">Additional Note</label>
              <textarea 
                id="note" 
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Any specific requirements..."
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors mt-6"
            >
              Submit Request
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Your request will be reviewed and published after admin approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostRoommateRequest;
