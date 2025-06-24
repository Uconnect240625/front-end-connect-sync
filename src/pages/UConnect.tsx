
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UConnect = () => {
  const navigate = useNavigate();

  const openFeature = (feature: string) => {
    // For now, show coming soon alert, but we can replace with actual navigation
    alert("🚧 Coming soon: " + feature.charAt(0).toUpperCase() + feature.slice(1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center">
      <div className="w-full max-w-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-black mb-2">
            <span className="bg-white px-1 mx-1 rounded">U</span>Connect
          </h1>
          <p className="text-gray-600">Your Campus in One App</p>
        </header>

        <section className="grid grid-cols-2 gap-5">
          <div 
            className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
            onClick={() => openFeature('notes')}
          >
            <img 
              src="https://img.icons8.com/color/96/open-book--v1.png" 
              alt="Notes Hub" 
              className="w-12 h-12 mx-auto mb-3"
            />
            <span className="block font-semibold text-blue-900">Notes Hub</span>
          </div>

          <div 
            className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
            onClick={() => openFeature('pg')}
          >
            <img 
              src="https://img.icons8.com/color/96/bedroom.png" 
              alt="PG Finder" 
              className="w-12 h-12 mx-auto mb-3"
            />
            <span className="block font-semibold text-blue-900">PG Finder</span>
          </div>

          <div 
            className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
            onClick={() => openFeature('marketplace')}
          >
            <img 
              src="https://img.icons8.com/color/96/shopping-cart--v1.png" 
              alt="Marketplace" 
              className="w-12 h-12 mx-auto mb-3"
            />
            <span className="block font-semibold text-blue-900">Marketplace</span>
          </div>

          <div 
            className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
            onClick={() => openFeature('mess')}
          >
            <img 
              src="https://img.icons8.com/color/96/restaurant.png" 
              alt="Mess Menu" 
              className="w-12 h-12 mx-auto mb-3"
            />
            <span className="block font-semibold text-blue-900">Mess Menu</span>
          </div>

          <div 
            className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
            onClick={() => openFeature('events')}
          >
            <img 
              src="https://img.icons8.com/color/96/calendar--v1.png" 
              alt="Events" 
              className="w-12 h-12 mx-auto mb-3"
            />
            <span className="block font-semibold text-blue-900">Events</span>
          </div>

          <div 
            className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
            onClick={() => openFeature('help')}
          >
            <img 
              src="https://img.icons8.com/color/96/help.png" 
              alt="Help Center" 
              className="w-12 h-12 mx-auto mb-3"
            />
            <span className="block font-semibold text-blue-900">Help Center</span>
          </div>
        </section>

        <footer className="text-center mt-8">
          <p className="text-sm text-gray-500">© 2025 CUConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default UConnect;
