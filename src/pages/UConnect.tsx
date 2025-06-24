
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const UConnect = () => {
  const navigate = useNavigate();

  const features = [
    { name: 'Notes Hub', icon: 'https://img.icons8.com/color/96/open-book--v1.png', route: '/notes' },
    { name: 'PG Finder', icon: 'https://img.icons8.com/color/96/bedroom.png', route: '/pg-finder' },
    { name: 'Marketplace', icon: 'https://img.icons8.com/color/96/shopping-cart--v1.png', route: '/marketplace' },
    { name: 'Mess Menu', icon: 'https://img.icons8.com/color/96/restaurant.png', route: '/mess-menu' },
    { name: 'Events', icon: 'https://img.icons8.com/color/96/calendar--v1.png', route: '/events' },
    { name: 'Help Center', icon: 'https://img.icons8.com/color/96/help.png', route: '/help' },
  ];

  const openFeature = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation />
      
      <div className="flex justify-center items-center py-8">
        <div className="w-full max-w-lg p-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-black mb-2">
              Welcome to <span className="px-1 mx-1 rounded">U</span>Connect
            </h1>
            <p className="text-gray-600">Your Campus in One App</p>
          </header>

          <section className="grid grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/90 rounded-2xl p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer"
                onClick={() => openFeature(feature.route)}
              >
                <img 
                  src={feature.icon} 
                  alt={feature.name} 
                  className="w-12 h-12 mx-auto mb-3"
                />
                <span className="block font-semibold text-blue-900">{feature.name}</span>
              </div>
            ))}
          </section>

          <div className="text-center mt-8 space-y-3">
            <button
              onClick={() => navigate('/announcements')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors mr-4"
            >
              📢 Announcements
            </button>
            
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => navigate('/club-dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                🎭 Club Dashboard
              </button>
              
              <button
                onClick={() => navigate('/post-roommate-request')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                🏠 Post Roommate Request
              </button>
              
              <button
                onClick={() => navigate('/upload-notes')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                📤 Upload Notes
              </button>
              
              <button
                onClick={() => navigate('/settings')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>

          <footer className="text-center mt-8">
            <p className="text-sm text-gray-500">© 2025 UConnect. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UConnect;
