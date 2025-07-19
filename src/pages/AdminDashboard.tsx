
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import ApprovalQueue from '@/components/admin/ApprovalQueue';
import AdminStats from '@/components/admin/AdminStats';
import ComplaintsManager from '@/components/admin/ComplaintsManager';
import NotificationManager from '@/components/admin/NotificationManager';

const AdminDashboard = () => {
  const [approvalItems, setApprovalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchApprovalItems = async () => {
    try {
      setLoading(true);
      
      // Get user's university_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('university_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.university_id) {
        toast.error('Could not determine your university');
        return;
      }

      // Fetch pending items from all tables
      const [pgListings, marketplaceItems, clubEvents, roommateRequests] = await Promise.all([
        supabase
          .from('pg_listings')
          .select(`
            *,
            profiles!inner(full_name)
          `)
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id),
        
        supabase
          .from('marketplace_items')
          .select(`
            *,
            profiles!inner(full_name)
          `)
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id),
        
        supabase
          .from('club_events')
          .select(`
            *,
            profiles!inner(full_name)
          `)
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id),
        
        supabase
          .from('roommate_requests')
          .select('*')
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id)
      ]);

      // Transform data for ApprovalQueue
      const items = [
        ...(pgListings.data || []).map(item => ({
          ...item,
          type: 'pg_listing',
          user_name: item.profiles?.full_name
        })),
        ...(marketplaceItems.data || []).map(item => ({
          ...item,
          type: 'marketplace_item',
          user_name: item.profiles?.full_name
        })),
        ...(clubEvents.data || []).map(item => ({
          ...item,
          type: 'club_event',
          user_name: item.profiles?.full_name,
          club_name: item.profiles?.full_name // Use the club's full name as club name
        })),
        ...(roommateRequests.data || []).map(item => ({
          ...item,
          type: 'roommate_request'
        }))
      ];

      setApprovalItems(items);
    } catch (error) {
      console.error('Error fetching approval items:', error);
      toast.error('Failed to load approval items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApprovalItems();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AdminStats />
          <ApprovalQueue items={approvalItems} onApprovalChange={fetchApprovalItems} />
        </div>
        
        <div className="space-y-6">
          <ComplaintsManager />
          <NotificationManager />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
