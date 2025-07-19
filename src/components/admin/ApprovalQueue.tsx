import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ApprovalStatus } from '@/types/database';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ApprovalItem {
  id: string;
  title: string;
  type: 'pg_listing' | 'marketplace_item' | 'club_event' | 'roommate_request';
  user_name?: string;
  requester_name?: string;
  created_at: string;
  is_paid: boolean;
  approval_status: ApprovalStatus;
  // Additional fields for roommate requests
  gender?: string;
  budget?: number;
  location?: string;
  contact_number?: string;
  preferences?: string;
  // Additional fields for marketplace items
  price?: number;
  description?: string;
  category?: string;
  image_urls?: string[];
  contact_phone?: string;
  // Additional fields for club events
  event_date?: string;
  event_time?: string;
  club_id?: string;
  club_name?: string;
  // Additional fields for PG listings
  pg_type?: string;
}

interface ApprovalQueueProps {
  items: ApprovalItem[];
  onApprovalChange: () => void;
}

const ApprovalQueue = ({ items, onApprovalChange }: ApprovalQueueProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  
  const handleApproval = async (itemId: string, type: string, status: 'approved' | 'rejected') => {
    try {
      console.log('Attempting to update approval:', { itemId, type, status });
      
      const tableName = type === 'pg_listing' ? 'pg_listings' : 
                       type === 'marketplace_item' ? 'marketplace_items' : 
                       type === 'club_event' ? 'club_events' : 'roommate_requests';
      
      console.log('Using table:', tableName);
      
      const { data, error } = await supabase
        .from(tableName)
        .update({ approval_status: status })
        .eq('id', itemId)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        
        // Provide more specific error messages
        if (error.code === '42501') {
          toast.error('Permission denied. You may not have admin privileges for this action.');
        } else if (error.code === '23503') {
          toast.error('Database constraint error. Please check the data integrity.');
        } else {
          toast.error(`Database error: ${error.message}`);
        }
        return;
      }

      console.log('Update successful:', data);
      toast.success(`${type.replace('_', ' ')} ${status} successfully`);
      onApprovalChange();
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error('Unexpected error occurred. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pg_listing': return '🏠';
      case 'marketplace_item': return '🛒';
      case 'club_event': return '🎉';
      case 'roommate_request': return '🧑‍🤝‍🧑';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pg_listing': return 'PG Listing';
      case 'marketplace_item': return 'Marketplace Item';
      case 'club_event': return 'Club Event';
      case 'roommate_request': return 'Roommate Request';
      default: return 'Unknown';
    }
  };

  const navigateImage = (itemId: string, direction: 'prev' | 'next', imageCount: number) => {
    setCurrentImageIndex(prev => {
      const current = prev[itemId] || 0;
      let newIndex;
      if (direction === 'prev') {
        newIndex = current === 0 ? imageCount - 1 : current - 1;
      } else {
        newIndex = current === imageCount - 1 ? 0 : current + 1;
      }
      return { ...prev, [itemId]: newIndex };
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderItemDetails = (item: ApprovalItem) => {
    if (item.type === 'roommate_request') {
      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600"><strong>Requester:</strong> {item.requester_name}</p>
          <p className="text-sm text-gray-600"><strong>Gender:</strong> {item.gender}</p>
          <p className="text-sm text-gray-600"><strong>Budget:</strong> ₹{item.budget}</p>
          <p className="text-sm text-gray-600"><strong>Location:</strong> {item.location}</p>
          <p className="text-sm text-gray-600"><strong>Contact:</strong> {item.contact_number}</p>
          {item.preferences && (
            <p className="text-sm text-gray-600"><strong>Preferences:</strong> {item.preferences}</p>
          )}
        </div>
      );
    }
    
    if (item.type === 'marketplace_item') {
      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600"><strong>Price:</strong> ₹{item.price}</p>
          <p className="text-sm text-gray-600"><strong>Category:</strong> {item.category}</p>
          {item.contact_phone && (
            <p className="text-sm text-gray-600"><strong>Contact:</strong> {item.contact_phone}</p>
          )}
          {item.description && (
            <p className="text-sm text-gray-600"><strong>Description:</strong> {item.description}</p>
          )}
          {item.image_urls && item.image_urls.length > 0 && (
            <div className="mt-3">
              <div className="relative">
                <img 
                  src={item.image_urls[currentImageIndex[item.id] || 0]} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                {item.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage(item.id, 'prev', item.image_urls!.length)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => navigateImage(item.id, 'next', item.image_urls!.length)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {item.image_urls.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === (currentImageIndex[item.id] || 0) ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.type === 'club_event') {
      return (
        <div className="space-y-2">
          {item.description && (
            <p className="text-sm text-gray-600"><strong>Description:</strong> {item.description}</p>
          )}
          {item.event_date && (
            <p className="text-sm text-gray-600"><strong>Event Date:</strong> {formatDate(item.event_date)}</p>
          )}
          {item.event_time && (
            <p className="text-sm text-gray-600"><strong>Event Time:</strong> {formatTime(item.event_time)}</p>
          )}
          {item.location && (
            <p className="text-sm text-gray-600"><strong>Location:</strong> {item.location}</p>
          )}
          {item.club_name && (
            <p className="text-sm text-gray-600"><strong>Club:</strong> {item.club_name}</p>
          )}
        </div>
      );
    }

    if (item.type === 'pg_listing') {
      return (
        <div className="space-y-2">
          {item.description && (
            <p className="text-sm text-gray-600"><strong>Description:</strong> {item.description}</p>
          )}
          {item.price && (
            <p className="text-sm text-gray-600"><strong>Price:</strong> ₹{item.price}</p>
          )}
          {item.location && (
            <p className="text-sm text-gray-600"><strong>Location:</strong> {item.location}</p>
          )}
          {item.contact_phone && (
            <p className="text-sm text-gray-600"><strong>Contact:</strong> {item.contact_phone}</p>
          )}
          {item.pg_type && (
            <p className="text-sm text-gray-600"><strong>Type:</strong> {item.pg_type}</p>
          )}
        </div>
      );
    }
    
    return item.user_name && (
      <p className="text-sm text-gray-600"><strong>By:</strong> {item.user_name}</p>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⏳</span>
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending approvals</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{getTypeIcon(item.type)}</span>
                      <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                      {item.type !== 'roommate_request' && (
                        <Badge 
                          variant={item.is_paid ? 'default' : 'destructive'}
                        >
                          {item.is_paid ? 'paid' : 'unpaid'}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold mb-3">{item.title}</h4>
                    {renderItemDetails(item)}
                    <p className="text-sm text-gray-500 mt-3">
                      <strong>Submitted:</strong> {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve {getTypeLabel(item.type)}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve "{item.title}"? This will make it visible to all users.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleApproval(item.id, item.type, 'approved')}>
                          Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                      >
                        ❌ Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject {getTypeLabel(item.type)}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject "{item.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleApproval(item.id, item.type, 'rejected')}>
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalQueue;
