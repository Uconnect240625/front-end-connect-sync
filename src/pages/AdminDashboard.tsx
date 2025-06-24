
import React from 'react';
import Navigation from '@/components/Navigation';

const AdminDashboard = () => {
  const handleApprove = (item: string) => {
    alert(`✅ ${item} approved!`);
  };

  const handleReject = (item: string) => {
    alert(`❌ ${item} rejected!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          🔐 Admin Dashboard
        </h2>

        {/* Sample Roommate Request */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Kabir Sabharwal <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Roommate</span>
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Year:</strong> 1st Year</p>
            <p><strong>Subject:</strong> Computer Science</p>
            <p><strong>Gender:</strong> Male</p>
            <p><strong>Budget:</strong> ₹6000</p>
            <p><strong>Location:</strong> Near Gate 1</p>
            <p><strong>Contact:</strong> +91 XXXXXXXX29</p>
            <p><strong>Note:</strong> Non-smoker, prefers 2-sharing.</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => handleApprove('Kabir\'s roommate request')}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              ✅ Approve
            </button>
            <button 
              onClick={() => handleReject('Kabir\'s roommate request')}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              ❌ Reject
            </button>
          </div>
        </div>

        {/* Sample PG Listing */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            Lovely PG <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">PG</span>
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Owner:</strong> Rajan Mehta</p>
            <p><strong>Location:</strong> Sector 125</p>
            <p><strong>Price:</strong> ₹7000</p>
            <p><strong>Type:</strong> 2 Sharing</p>
            <p><strong>Facilities:</strong> AC, WiFi, Meals</p>
            <p><strong>Contact:</strong> +91 XXXXXXXX42</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => handleApprove('Lovely PG listing')}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              ✅ Approve
            </button>
            <button 
              onClick={() => handleReject('Lovely PG listing')}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
