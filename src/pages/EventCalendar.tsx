import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { OfficialEventForm } from '@/components/admin/OfficialEventForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  approval_status: string;
}

interface OfficialEvent {
  id?: string;
  date: string;
  title: string;
  description: string;
  location: string;
}

const EventCalendar = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('official');
  const [clubEvents, setClubEvents] = useState<Event[]>([]);
  const [officialEvents, setOfficialEvents] = useState<OfficialEvent[]>([
    {
      id: '1',
      date: '24 July',
      title: 'Orientation Day',
      description: 'Welcome session for 1st year students',
      location: 'Main Auditorium'
    },
    {
      id: '2',
      date: '15 August',
      title: 'Independence Day Celebration',
      description: 'Flag hoisting and cultural show',
      location: 'Ground A'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
    type: 'official' | 'club';
  }>({
    isOpen: false,
    eventId: '',
    eventTitle: '',
    type: 'official'
  });

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

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

  // Delete official event (admin only) with confirmation modal
  const deleteOfficialEvent = (eventId: string) => {
    if (profile?.role !== 'admin') return;
    
    const event = officialEvents.find(e => e.id === eventId);
    if (!event) return;

    setDeleteDialog({
      isOpen: true,
      eventId,
      eventTitle: event.title,
      type: 'official'
    });
  };

  // Delete club event (admin or club owner) with confirmation modal
  const deleteClubEvent = (eventId: string) => {
    const event = clubEvents.find(e => e.id === eventId);
    if (!event) return;

    setDeleteDialog({
      isOpen: true,
      eventId,
      eventTitle: event.title,
      type: 'club'
    });
  };

  // Handle confirmed deletion
  const handleConfirmedDelete = async () => {
    const { eventId, type } = deleteDialog;
    
    try {
      if (type === 'official') {
        setOfficialEvents(prev => prev.filter(event => event.id !== eventId));
        toast({ title: "Success", description: "Official event deleted successfully" });
      } else {
        const { error } = await supabase
          .from('club_events')
          .delete()
          .eq('id', eventId);

        if (error) throw error;

        setClubEvents(prev => prev.filter(event => event.id !== eventId));
        toast({ title: "Success", description: "Club event deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete event. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setDeleteDialog({ isOpen: false, eventId: '', eventTitle: '', type: 'official' });
    }
  };

  // Create new official event (admin only)
  const handleEventCreated = (newEvent: OfficialEvent) => {
    setOfficialEvents(prev => [...prev, newEvent]);
  };

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Check if user can delete events
  const canDeleteOfficialEvents = profile?.role === 'admin';
  const canDeleteClubEvents = profile?.role === 'admin' || profile?.role === 'club';
  const canCreateOfficialEvents = profile?.role === 'admin';
  const canCreateClubEvents = profile?.role === 'club';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-primary hover:text-primary/80 flex items-center justify-center mx-auto"
          >
            ← Back to U Connect
          </button>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Event Calendar</h2>
          </div>
          <p className="text-muted-foreground">Stay updated with all things happening</p>
        </header>

        {/* Create Button - Show for admins on official tab or clubs on club tab */}
        {((canCreateOfficialEvents && activeTab === 'official') || (canCreateClubEvents && activeTab === 'club')) && (
          <div className="flex justify-center mb-4">
            <Button 
              size="sm"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800"
              onClick={() => {
                if (activeTab === 'official') {
                  setIsEventFormOpen(true);
                } else {
                  navigate('/post-club-event');
                }
              }}
            >
              <Plus className="w-4 h-4" />
              Create {activeTab === 'official' ? 'Official Event' : 'Club Event'}
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'official'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => switchTab('official')}
          >
            Calendar
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'club'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => switchTab('club')}
          >
            Club Events
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'official' ? (
            // Official events
            officialEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                <div className="flex gap-4">
                  <div className="text-primary font-bold text-lg text-center min-w-[80px]">
                    {event.date}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-card-foreground mb-1">{event.title}</h3>
                        <p className="text-muted-foreground mb-2 text-sm">{event.description}</p>
                        <span className="text-sm text-muted-foreground">{event.location}</span>
                      </div>
                      {canDeleteOfficialEvents && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteOfficialEvent(event.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Club events from database
            loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading events...</p>
              </div>
            ) : clubEvents.length > 0 ? (
              clubEvents.map((event) => (
                <div key={event.id} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <div className="flex gap-4">
                    <div className="text-primary font-bold text-lg text-center min-w-[80px]">
                      {formatEventDate(event.event_date)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-card-foreground mb-1">{event.title}</h3>
                          <p className="text-muted-foreground mb-2 text-sm">{event.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{event.location}</span>
                            {event.event_time && (
                              <span className="text-sm text-primary font-medium">
                                {event.event_time}
                              </span>
                            )}
                          </div>
                        </div>
                        {canDeleteClubEvents && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteClubEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No club events available</p>
              </div>
            )
          )}
        </div>

        {/* Official Event Form Modal */}
        <OfficialEventForm
          isOpen={isEventFormOpen}
          onClose={() => setIsEventFormOpen(false)}
          onEventCreated={handleEventCreated}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, eventId: '', eventTitle: '', type: 'official' })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {deleteDialog.type === 'official' ? 'Official Event' : 'Club Event'}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteDialog.eventTitle}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmedDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EventCalendar;
