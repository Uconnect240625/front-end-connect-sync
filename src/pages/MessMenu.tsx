
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MessMenu = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('monday');

  const switchDay = (dayId: string) => {
    setActiveDay(dayId);
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const menuData = {
    monday: {
      breakfast: 'Aloo Paratha, Curd, Tea',
      lunch: 'Rajma, Rice, Roti, Salad',
      snacks: 'Tea & Biscuits',
      dinner: 'Paneer Butter Masala, Naan, Gulab Jamun'
    },
    tuesday: {
      breakfast: 'Idli, Sambhar, Coconut Chutney',
      lunch: 'Chole, Rice, Roti, Boondi Raita',
      snacks: 'Maggi, Tea',
      dinner: 'Mix Veg, Jeera Rice, Chapati, Kheer'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to U Connect
          </button>
          <h2 className="text-2xl font-semibold">🍽️ Mess Menu</h2>
          <p className="text-gray-600">Check your weekly meal plan</p>
        </header>

        <div className="flex justify-between mb-6 overflow-x-auto gap-2">
          {days.map((day, index) => (
            <button
              key={day}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => switchDay(day)}
            >
              {dayLabels[index]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {menuData[activeDay as keyof typeof menuData] ? (
            Object.entries(menuData[activeDay as keyof typeof menuData]).map(([meal, items]) => (
              <div key={meal} className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-red-600 mb-2 capitalize">
                  {meal === 'breakfast' && '🍳'} 
                  {meal === 'lunch' && '🍛'} 
                  {meal === 'snacks' && '☕'} 
                  {meal === 'dinner' && '🍲'} 
                  {meal}
                </h3>
                <p className="text-gray-600">{items}</p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-4 shadow-sm text-center text-gray-500">
              Menu for {activeDay} coming soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessMenu;
