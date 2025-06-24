
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';

const PostClubEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDesc: '',
    eventDate: '',
    eventTime: '',
    location: '',
    clubName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('✅ Event submitted for approval! Payment of ₹50 required.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-6">
            Post <span className="text-blue-600">Club</span> Event
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="eventName" className="block font-medium mb-2">Event Title</label>
              <input 
                type="text" 
                id="eventName" 
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Enter event name" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="eventDesc" className="block font-medium mb-2">Description</label>
              <textarea 
                id="eventDesc" 
                rows={4} 
                value={formData.eventDesc}
                onChange={handleInputChange}
                placeholder="Enter event details..." 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="eventDate" className="block font-medium mb-2">Date</label>
              <input 
                type="date" 
                id="eventDate" 
                value={formData.eventDate}
                onChange={handleInputChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="eventTime" className="block font-medium mb-2">Time</label>
              <input 
                type="time" 
                id="eventTime" 
                value={formData.eventTime}
                onChange={handleInputChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block font-medium mb-2">Location</label>
              <input 
                type="text" 
                id="location" 
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Block 8 Auditorium, CU" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="clubName" className="block font-medium mb-2">Club Name</label>
              <input 
                type="text" 
                id="clubName" 
                value={formData.clubName}
                onChange={handleInputChange}
                placeholder="e.g., Tech Society" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
            >
              Submit & Pay ₹50
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Your event will be reviewed and shown in the Club Events Calendar upon approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostClubEvent;
