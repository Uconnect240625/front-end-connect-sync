
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';

const MessMenuAdmin = () => {
  const [day, setDay] = useState('Monday');
  const [meal, setMeal] = useState('Breakfast');
  const [items, setItems] = useState('');

  const saveMenu = () => {
    alert(`✅ Menu Updated for ${day} – ${meal}:\n${items}`);
    // Here you'd actually send this data to a backend or database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <h2 className="text-center text-2xl font-bold text-red-600 mb-6">
          Mess Menu Admin Panel
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="day" className="block font-medium mb-2">Select Day</label>
            <select 
              id="day" 
              value={day} 
              onChange={(e) => setDay(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="meal" className="block font-medium mb-2">Select Meal</label>
            <select 
              id="meal" 
              value={meal} 
              onChange={(e) => setMeal(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="items" className="block font-medium mb-2">Enter Menu Items</label>
            <input 
              type="text" 
              id="items" 
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g., Chole Bhature, Salad, Rice"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button 
            onClick={saveMenu}
            className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition-colors"
          >
            Save Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessMenuAdmin;
