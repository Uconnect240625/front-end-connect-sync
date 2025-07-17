
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
}

interface ApprovalQueueProps {
  items: ApprovalItem[];
  onApprovalChange: () => void;
}

const ApprovalQueue = ({ items, onApprovalChange }: ApprovalQueueProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const handleApproval = async (itemId: string, type: string, status: 'approved' | 'rejected') => {
    try {
      const tableName = type === 'pg_listing' ? 'pg_listings' : 
                       type === 'marketplace_item' ? 'marketplace_items' : 
                       type === 'club_event' ? 'club_events' : 'roommate_requests';
      
      const { error } = await supabase
        .from(tableName)
        .update({ approval_status: status })
        .eq('id', itemId);

      if (error) throw error;

      toast.success(`Item ${status} successfully`);
      onApprovalChange();
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error('Failed to update approval status');
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

  const renderItemDetails = (item: ApprovalItem) => {
    if (item.type === 'roommate_request') {
      return (
        <>
          <p className="text-sm text-gray-600">By: {item.requester_name}</p>
          <p className="text-sm text-gray-600">Gender: {item.gender}</p>
          <p className="text-sm text-gray-600">Budget: ₹{item.budget}</p>
          <p className="text-sm text-gray-600">Location: {item.location}</p>
          <p className="text-sm text-gray-600">Contact: {item.contact_number}</p>
          {item.preferences && (
            <p className="text-sm text-gray-600">Preferences: {item.preferences}</p>
          )}
        </>
      );
    }
    
    if (item.type === 'marketplace_item') {
      return (
        <>
          <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
          <p className="text-sm text-gray-600">Category: {item.category}</p>
          {item.description && (
            <p className="text-sm text-gray-600">Description: {item.description}</p>
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
        </>
      );
    }
    
    return item.user_name && (
      <p className="text-sm text-gray-600">By: {item.user_name}</p>
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
                    <h4 className="font-semibold">{item.title}</h4>
                    {renderItemDetails(item)}
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(item.created_at).toLocaleDateString()}
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
