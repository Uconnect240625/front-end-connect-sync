
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PGFinder = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pgs');

  const pgListings = [
    {
      name: 'Star Boys PG',
      location: 'Sector 125, Near Gate 2',
      price: '₹6,500/month',
      contact: '9876543210',
      type: 'PG Listing'
    }
  ];

  const roommateRequests = [
    {
      name: 'Roommate Needed for Phase 1',
      from: 'Arjun Singh',
      looking: '1 Male roommate (Non-smoker, Student)',
      rent: '₹5,800/month',
      type: 'Roommate Request'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to U Connect
          </button>
          <h2 className="text-2xl font-semibold">🏠 PG & Roommate Finder</h2>
        </header>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'pgs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('pgs')}
          >
            PG Listings
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'roommates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('roommates')}
          >
            Roommate Requests
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'pgs' ? 
            pgListings.map((listing, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-2">💼 {listing.name}</h3>
                <p><strong>Location:</strong> {listing.location}</p>
                <p><strong>Price:</strong> {listing.price}</p>
                <p><strong>Contact:</strong> {listing.contact}</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mt-2">
                  {listing.type}
                </span>
              </div>
            )) :
            roommateRequests.map((request, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-2">🧑‍🤝‍🧑 {request.name}</h3>
                <p><strong>From:</strong> {request.from}</p>
                <p><strong>Looking for:</strong> {request.looking}</p>
                <p><strong>Rent:</strong> {request.rent}</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mt-2">
                  {request.type}
                </span>
              </div>
            ))
          }
        </div>

        <button 
          onClick={() => alert('Post functionality coming soon!')}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          + Post Request
        </button>
      </div>
    </div>
  );
};

export default PGFinder;
