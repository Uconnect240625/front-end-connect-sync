import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  user_id: string | null;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'General', 'Urgent', 'Maintenance', 'Academic'];

  useEffect(() => {
    if (profile?.university_id) {
      fetchNotifications();
    }
  }, [profile?.university_id]);

  const fetchNotifications = async () => {
    if (!profile?.university_id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('university_id', profile.university_id)
        .or(`user_id.eq.${profile.id},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'All') return true;
    return notification.type === activeFilter.toLowerCase();
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'maintenance': return '🔧';
      case 'academic': return '📚';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-red-600 text-white p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Bell size={24} />
            <h1 className="text-xl font-bold">🔔 Notifications</h1>
          </div>
        </div>

        <div className="flex overflow-x-auto p-3 bg-card border-b border-border gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap ${
                activeFilter === filter 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="p-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                No {activeFilter.toLowerCase()} notifications available
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="bg-card rounded-xl p-4 shadow-sm border border-border transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                        <h3 className="font-semibold text-lg text-red-600">
                          {notification.title}
                        </h3>
                      </div>
                      <p className="text-card-foreground mb-3">{notification.message}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </div>
                    </div>
                  </div>
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
