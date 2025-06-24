
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const navigate = useNavigate();

  const sampleProducts = [
    {
      name: 'MacBook Pro',
      price: '₹45,000',
      student: 'Rahul Kumar',
      phone: '98765xxxxx',
      description: 'Excellent condition, used for 1 year',
      image: 'https://via.placeholder.com/200x150'
    },
    {
      name: 'Physics Textbook',
      price: '₹800',
      student: 'Priya Singh',
      phone: '87654xxxxx',
      description: 'All chapters covered, minimal highlighting',
      image: 'https://via.placeholder.com/200x150'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to U Connect
          </button>
          <h1 className="text-3xl font-bold mb-2">🛒 Marketplace</h1>
          <p className="text-gray-600">Buy & Sell with 30,000+ Students</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            All Categories
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
            List your product (₹50)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.map((product, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{product.student}</p>
              <p className="text-sm text-gray-700 mb-3">{product.phone}</p>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-bold mb-4">{product.price}</p>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors w-full">
                Contact Seller
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
