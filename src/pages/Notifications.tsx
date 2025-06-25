
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Official', 'Clubs', 'Hostel', 'Academics', 'Emergency'];

  const notifications = [
    {
      id: 1,
      title: 'Class Suspension Notice',
      message: 'All classes are suspended tomorrow due to heavy rainfall.',
      type: 'Official',
      date: 'June 17, 2025'
    },
    {
      id: 2,
      title: 'Photography Club Event',
      message: 'Join the flash walk on 18th June! Register now.',
      type: 'Clubs',
      date: 'June 16, 2025'
    },
    {
      id: 3,
      title: 'Urgent: Power Cut Alert',
      message: 'Power will be cut in Block D from 2PM–4PM today.',
      type: 'Emergency',
      date: 'June 16, 2025'
    },
    {
      id: 4,
      title: 'Hostel Maintenance',
      message: 'Water supply will be interrupted in Block A from 6AM-8AM tomorrow.',
      type: 'Hostel',
      date: 'June 15, 2025'
    },
    {
      id: 5,
      title: 'Assignment Deadline Extended',
      message: 'Computer Networks assignment deadline extended to June 20th.',
      type: 'Academics',
      date: 'June 14, 2025'
    }
  ];

  const filteredNotifications = activeFilter === 'All' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Official':
        return 'bg-blue-100 text-blue-800';
      case 'Clubs':
        return 'bg-purple-100 text-purple-800';
      case 'Hostel':
        return 'bg-green-100 text-green-800';
      case 'Academics':
        return 'bg-yellow-100 text-yellow-800';
      case 'Emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <div className="bg-red-600 text-white p-4 rounded-t-lg text-center">
          <div className="flex items-center justify-center space-x-2">
            <Bell size={20} />
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-b-lg shadow-sm">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No notifications found for the selected filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {notification.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-400">{notification.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
