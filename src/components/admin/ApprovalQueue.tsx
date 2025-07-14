
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ApprovalStatus } from '@/types/database';

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
}

interface ApprovalQueueProps {
  items: ApprovalItem[];
  onApprovalChange: () => void;
}

const ApprovalQueue = ({ items, onApprovalChange }: ApprovalQueueProps) => {
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
                  <Button
                    size="sm"
                    onClick={() => handleApproval(item.id, item.type, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleApproval(item.id, item.type, 'rejected')}
                  >
                    ❌ Reject
                  </Button>
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
