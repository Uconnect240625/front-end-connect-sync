
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isDark = localStorage.getItem('uconnectDarkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('uconnectDarkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('uconnectDarkMode', 'false');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border-b">
              <span className="font-medium">🌙 Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div 
              className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50"
              onClick={handleEditProfile}
            >
              <span className="font-medium">👤 Edit Profile</span>
              <span className="text-gray-400">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50">
              <span className="font-medium">🔐 Change Password</span>
              <span className="text-gray-400">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50">
              <span className="font-medium">🔔 Notification Settings</span>
              <span className="text-gray-400">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50">
              <span className="font-medium">🔒 Privacy & Security</span>
              <span className="text-gray-400">›</span>
            </div>

            <div className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50">
              <span className="font-medium">🛠 Help & Support</span>
              <span className="text-gray-400">›</span>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-red-700 transition-colors"
          >
            Logout
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            UConnect v1.0 • Crafted by Kabir 🔥
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
