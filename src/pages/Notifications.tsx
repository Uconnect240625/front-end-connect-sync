import React from 'react';
import Navigation from '@/components/Navigation';
import NotificationHeader from '@/components/notifications/NotificationHeader';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import NotificationList from '@/components/notifications/NotificationList';
import { useNotifications } from '@/components/notifications/useNotifications';

const Notifications = () => {
  const { notifications, loading, activeFilter, setActiveFilter } = useNotifications();

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
        <NotificationHeader />
        
        <NotificationFilters 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="p-4">
          <NotificationList 
            notifications={notifications}
            activeFilter={activeFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;