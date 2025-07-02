import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Notification, NotificationFilter } from './types';

export const useNotifications = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('All');

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

  return {
    notifications: filteredNotifications,
    loading,
    activeFilter,
    setActiveFilter,
  };
};