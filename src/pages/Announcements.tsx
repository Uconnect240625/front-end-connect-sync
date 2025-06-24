
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Announcements = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('official');

  const officialAnnouncements = [
    {
      title: 'Mid-Sem Exam Schedule Out',
      badge: 'Exams',
      content: 'Mid-semester exams will begin from 10th July. Check your department notice board for detailed datesheets.',
      date: 'June 17, 2025'
    },
    {
      title: 'Holiday on Guru Purnima',
      badge: 'Holiday',
      content: 'University will remain closed on 21st July in celebration of Guru Purnima.',
      date: 'June 15, 2025'
    }
  ];

  const studentAnnouncements = [
    {
      title: 'TEDxU Speaker Hunt 🎤',
      badge: 'Club Event',
      content: "Think you've got a story worth sharing? Apply to be a speaker for TEDxU 2025. Applications close July 5.",
      date: 'June 16, 2025'
    },
    {
      title: 'Found: AirPods in Block B',
      badge: 'Lost & Found',
      content: "If you've lost your AirPods near Block B stairs, contact Sahil (CSE 2nd Year) at 98xxxxxx23.",
      date: 'June 14, 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to U Connect
          </button>
          <h2 className="text-2xl font-semibold">📣 Announcements</h2>
        </header>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'official'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('official')}
          >
            🏛️ Official
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('student')}
          >
            🎓 Student
          </button>
        </div>

        <div className="space-y-4">
          {(activeTab === 'official' ? officialAnnouncements : studentAnnouncements).map((announcement, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm transition-transform hover:scale-105">
              <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                activeTab === 'official' ? 'bg-red-100 text-red-800' : 'bg-red-100 text-red-800'
              }`}>
                {announcement.badge}
              </span>
              <p className="text-gray-600 mb-3">{announcement.content}</p>
              <span className="text-sm text-gray-500">📅 {announcement.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
