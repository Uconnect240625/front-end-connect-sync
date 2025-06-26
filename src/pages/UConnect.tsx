import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';

const UConnect = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const features = [
    {
      icon: '🍽️',
      title: 'Mess Menu',
      path: '/mess-menu'
    },
    {
      icon: '📚',
      title: 'Notes Hub',
      path: '/notes'
    },
    {
      icon: '📅',
      title: 'Event Calendar',
      path: '/events'
    },
    {
      icon: '📢',
      title: 'Announcements',
      path: '/announcements'
    },
    {
      icon: '🛒',
      title: 'Marketplace',
      path: '/marketplace'
    },
    {
      icon: '🏠',
      title: 'PG Finder',
      path: '/pg-finder'
    },
    {
      icon: '🚨',
      title: 'Help Center',
      path: '/help-center'
    },
    {
      icon: '⚙️',
      title: 'Settings',
      path: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-blue-900">U</span>
            <span className="text-red-600">Connect</span>
          </h1>
          <p className="text-gray-600">Your Campus Smart Companion</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/50"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <span className="block font-semibold text-blue-900 text-sm">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        {profile?.role === 'admin' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-600 mb-4 text-center">
              🛡️ Admin Features
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '⚡', title: 'Admin Dashboard', path: '/admin' },
                { icon: '📊', title: 'Analytics', path: '/admin/analytics' },
                { icon: '💰', title: 'Revenue', path: '/admin/revenue' },
                { icon: '🍽️', title: 'Mess Menu Admin', path: '/mess-menu-admin' },
                { icon: '🆘', title: 'Help Center Admin', path: '/help-center-admin' }
              ].map((feature, index) => (
                <div
                  key={index}
                  onClick={() => navigate(feature.path)}
                  className="bg-red-50/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-red-200"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <span className="block font-semibold text-red-700 text-xs">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center text-gray-500 text-sm">
          <p>© 2025 U Connect. Connecting Campus Life.</p>
        </footer>
      </div>
    </div>
  );
};

export default UConnect;
