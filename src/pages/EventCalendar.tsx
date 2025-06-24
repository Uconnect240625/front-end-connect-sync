
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventCalendar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('official');

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const officialEvents = [
    {
      date: '24 July',
      title: 'Orientation Day',
      description: 'Welcome session for 1st year students',
      location: 'Main Auditorium'
    },
    {
      date: '15 August',
      title: 'Independence Day Celebration',
      description: 'Flag hoisting and cultural show',
      location: 'Ground A'
    }
  ];

  const clubEvents = [
    {
      date: '20 June',
      title: 'Photography Walk',
      description: 'Join us for a sunset photo tour 🌇',
      location: 'Lake Area'
    },
    {
      date: '25 June',
      title: 'Startup Pitch Night',
      description: 'Showcase your idea. Win prizes 💡',
      location: 'Block E Auditorium'
    }
  ];

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
          <h2 className="text-2xl font-semibold">📅 Event Calendar</h2>
          <p className="text-gray-600">Stay updated with all things happening at CU</p>
        </header>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'official'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => switchTab('official')}
          >
            Calendar
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'club'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => switchTab('club')}
          >
            Club Events
          </button>
        </div>

        <div className="space-y-4">
          {(activeTab === 'official' ? officialEvents : clubEvents).map((event, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
              <div className="text-blue-600 font-bold text-lg text-center w-20">
                {event.date}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-600 mb-1">{event.description}</p>
                <span className="text-sm text-gray-500">{event.location}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors">
          ➕ Add Club Event (₹50)
        </button>
      </div>
    </div>
  );
};

export default EventCalendar;
