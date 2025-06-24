
import React from 'react';
import Navigation from '@/components/Navigation';

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h2 className="text-center text-2xl font-bold text-red-600 mb-8">📊 U Connect Admin Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="text-3xl text-red-600 mb-3">💰</div>
            <h3 className="text-2xl font-bold text-gray-800">₹18,500</h3>
            <p className="text-gray-600">Total Earnings (This Month)</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="text-3xl text-red-600 mb-3">🧑‍🎓</div>
            <h3 className="text-2xl font-bold text-gray-800">1,324</h3>
            <p className="text-gray-600">Active Users</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="text-3xl text-red-600 mb-3">📄</div>
            <h3 className="text-2xl font-bold text-gray-800">438</h3>
            <p className="text-gray-600">Notes Uploaded</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="text-3xl text-red-600 mb-3">🧑‍🤝‍🧑</div>
            <h3 className="text-2xl font-bold text-gray-800">127</h3>
            <p className="text-gray-600">Roommate Listings</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="text-3xl text-red-600 mb-3">📢</div>
            <h3 className="text-2xl font-bold text-gray-800">61</h3>
            <p className="text-gray-600">Notices Posted</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md text-center">
            <div className="text-3xl text-red-600 mb-3">🛠️</div>
            <h3 className="text-2xl font-bold text-gray-800">19</h3>
            <p className="text-gray-600">Pending Complaints</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Earnings Chart</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📊 Chart.js integration would go here
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
