
import React from 'react';
import Navigation from '@/components/Navigation';

const AdminRevenue = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-red-600 mb-6">Admin Revenue</h2>

          <div className="bg-red-600 text-white p-5 rounded-xl text-center mb-5">
            <h3 className="text-lg mb-2">Total Collected</h3>
            <p className="text-3xl font-bold">₹1,750</p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Breakdown</h4>
            
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between mb-2">
              <span>Club Event Fees</span>
              <span className="font-semibold">₹350</span>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between mb-2">
              <span>Marketplace Commission</span>
              <span className="font-semibold">₹1,200</span>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
              <span>PG Listing Fees</span>
              <span className="font-semibold">₹200</span>
            </div>
          </div>

          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Withdraw to Bank
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenue;
