
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PostClubEvent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDesc: '',
    eventDate: '',
    eventTime: '',
    location: '',
    clubName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let formattedValue = inputValue.replace(/\D/g, ''); // Remove non-digits
    
    if (formattedValue.length >= 2) {
      formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
    }
    if (formattedValue.length >= 5) {
      formattedValue = formattedValue.substring(0, 5) + '/' + formattedValue.substring(5, 9);
    }
    
    setFormData({
      ...formData,
      eventDate: formattedValue
    });
  };

  const parseDateToISO = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an event.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse the date from DD/MM/YYYY to YYYY-MM-DD for database
      const parsedDate = parseDateToISO(formData.eventDate);

      const { error } = await supabase
        .from('club_events')
        .insert({
          title: formData.eventName,
          description: formData.eventDesc,
          event_date: parsedDate,
          event_time: formData.eventTime,
          location: formData.location,
          club_id: user.id,
          university_id: (await supabase.from('profiles').select('university_id').eq('id', user.id).single()).data?.university_id,
          approval_status: 'pending',
          is_paid: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event submitted for approval!",
      });

      // Reset form
      setFormData({
        eventName: '',
        eventDesc: '',
        eventDate: '',
        eventTime: '',
        location: '',
        clubName: ''
      });

    } catch (error) {
      console.error('Error submitting event:', error);
      toast({
        title: "Error",
        description: "Failed to submit event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-6">
            Post <span className="text-blue-600">Club</span> Event
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="eventName" className="block font-medium mb-2">Event Title</label>
              <input 
                type="text" 
                id="eventName" 
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Enter event name" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="eventDesc" className="block font-medium mb-2">Description</label>
              <textarea 
                id="eventDesc" 
                rows={4} 
                value={formData.eventDesc}
                onChange={handleInputChange}
                placeholder="Enter event details..." 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="eventDate" className="block font-medium mb-2">Date</label>
              <input 
                type="text" 
                id="eventDate" 
                value={formData.eventDate}
                onChange={handleDateChange}
                placeholder="DD/MM/YYYY"
                maxLength={10}
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="eventTime" className="block font-medium mb-2">Time</label>
              <input 
                type="time" 
                id="eventTime" 
                value={formData.eventTime}
                onChange={handleInputChange}
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block font-medium mb-2">Location</label>
              <input 
                type="text" 
                id="location" 
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Block 8 Auditorium, CU" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="clubName" className="block font-medium mb-2">Club Name</label>
              <input 
                type="text" 
                id="clubName" 
                value={formData.clubName}
                onChange={handleInputChange}
                placeholder="e.g., Tech Society" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Pay ₹50'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Your event will be reviewed and shown in the Club Events Calendar upon approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostClubEvent;
