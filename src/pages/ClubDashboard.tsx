
import React from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

const ClubDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-6">
            Club <span className="text-blue-600">Dashboard</span>
          </h2>

          <button 
            onClick={() => navigate('/post-club-event')}
            className="w-full bg-red-600 text-white py-3 rounded-lg mb-3 font-bold hover:bg-red-700 transition-colors"
          >
            Post New Event (₹50)
          </button>
          
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg mb-6 font-bold hover:bg-blue-700 transition-colors">
            View Submissions
          </button>

          <h3 className="text-lg font-semibold mb-4 text-gray-700">Your Events</h3>

          <div className="bg-gray-100 p-4 rounded-lg mb-3">
            <h4 className="font-semibold text-gray-800">Tech Talk: AI in 2025</h4>
            <p className="text-sm text-gray-600">Date: July 10, 2025</p>
            <p className="text-sm">Status: <span className="text-green-600 font-bold">Approved</span></p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800">Open Mic Night</h4>
            <p className="text-sm text-gray-600">Date: July 18, 2025</p>
            <p className="text-sm">Status: <span className="text-orange-600 font-bold">Pending</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
