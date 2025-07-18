
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  approval_status: string;
}

const EventCalendar = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('official');
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Static official events (as per original)
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

  // Fetch club events from database
  useEffect(() => {
    const fetchClubEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('club_events')
          .select('*')
          .eq('approval_status', 'approved')
          .order('event_date', { ascending: true });

        if (error) {
          console.error('Error fetching club events:', error);
        } else {
          setClubEvents(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubEvents();
  }, []);

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
          >
            ← Back to U Connect
          </button>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Event Calendar</h2>
          </div>
          <p className="text-gray-600">Stay updated with all things happening</p>
        </header>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'official'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => switchTab('official')}
          >
            Calendar
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'club'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => switchTab('club')}
          >
            Club Events
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'official' ? (
            // Official events
            officialEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="text-blue-600 font-bold text-lg text-center min-w-[80px]">
                    {event.date}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-gray-600 mb-2 text-sm">{event.description}</p>
                    <span className="text-sm text-gray-500">{event.location}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Club events from database
            loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading events...</p>
              </div>
            ) : clubEvents.length > 0 ? (
              clubEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex gap-4">
                    <div className="text-blue-600 font-bold text-lg text-center min-w-[80px]">
                      {formatEventDate(event.event_date)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">{event.title}</h3>
                      <p className="text-gray-600 mb-2 text-sm">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{event.location}</span>
                        {event.event_time && (
                          <span className="text-sm text-blue-600 font-medium">
                            {event.event_time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No club events available</p>
              </div>
            )
          )}
        </div>

        {/* Add Club Event Button - Only show for club role */}
        {profile?.role === 'club' && (
          <button 
            onClick={() => navigate('/post-club-event')}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            ➕ Add Club Event (₹50)
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
