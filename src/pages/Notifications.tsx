

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import NotificationHeader from '@/components/notifications/NotificationHeader';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import NotificationList from '@/components/notifications/NotificationList';
import { useNotifications } from '@/components/notifications/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
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

export default function Notifications() {
  const { notifications, activeFilter, setActiveFilter } = useNotifications();
  const { profile } = useAuth();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    notificationId: string;
    notificationTitle: string;
  }>({
    isOpen: false,
    notificationId: '',
    notificationTitle: ''
  });

  const canDeleteNotifications = profile?.role === 'admin';

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'All') return true;
    return notification.type === activeFilter.toLowerCase();
  });

  const handleDeleteNotification = (notificationId: string, title: string) => {
    if (!canDeleteNotifications) return;
    
    setDeleteDialog({
      isOpen: true,
      notificationId,
      notificationTitle: title
    });
  };

  const handleConfirmedDelete = () => {
    // Here you would typically delete from the database
    // For now, just show a success message
    toast({ 
      title: "Success", 
      description: "Notification deleted successfully" 
    });
    
    setDeleteDialog({ 
      isOpen: false, 
      notificationId: '', 
      notificationTitle: '' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationHeader />
      <NotificationFilters 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      
      <div className="px-4 pb-6">
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm relative">
            {canDeleteNotifications && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteNotification(notification.id, notification.title)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <h3 className="font-semibold text-red-600 mb-2 pr-8">
              {notification.title}
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              {notification.message}
            </p>
            <div className="text-gray-500 text-xs text-right">
              {notification.created_at}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, notificationId: '', notificationTitle: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.notificationTitle}"? This action cannot be undone.
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
  );
}

