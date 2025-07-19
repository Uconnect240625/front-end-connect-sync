
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
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    totalUsers: 0,
    totalComplaints: 0,
    resolvedComplaints: 0
  });
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

      // Fetch pending items from all tables without joins first
      const [pgListings, marketplaceItems, clubEvents, roommateRequests] = await Promise.all([
        supabase
          .from('pg_listings')
          .select('*')
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id),
        
        supabase
          .from('marketplace_items')
          .select('*')
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id),
        
        supabase
          .from('club_events')
          .select('*')
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id),
        
        supabase
          .from('roommate_requests')
          .select('*')
          .eq('approval_status', 'pending')
          .eq('university_id', profile.university_id)
      ]);

      // Get all unique user IDs from the results
      const allUserIds = [
        ...(pgListings.data || []).map(item => item.user_id),
        ...(marketplaceItems.data || []).map(item => item.user_id),
        ...(clubEvents.data || []).map(item => item.club_id),
        ...(roommateRequests.data || []).map(item => item.user_id)
      ].filter(Boolean);

      // Fetch profile data for all users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', [...new Set(allUserIds)]);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      // Transform data for ApprovalQueue
      const items = [
        ...(pgListings.data || []).map(item => ({
          ...item,
          type: 'pg_listing',
          user_name: profileMap.get(item.user_id) || 'Unknown User'
        })),
        ...(marketplaceItems.data || []).map(item => ({
          ...item,
          type: 'marketplace_item',
          user_name: profileMap.get(item.user_id) || 'Unknown User'
        })),
        ...(clubEvents.data || []).map(item => ({
          ...item,
          type: 'club_event',
          user_name: profileMap.get(item.club_id) || 'Unknown Club',
          club_name: profileMap.get(item.club_id) || 'Unknown Club'
        })),
        ...(roommateRequests.data || []).map(item => ({
          ...item,
          type: 'roommate_request',
          user_name: profileMap.get(item.user_id) || 'Unknown User'
        }))
      ];

      setApprovalItems(items);

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingApprovals: items.length
      }));

    } catch (error) {
      console.error('Error fetching approval items:', error);
      toast.error('Failed to load approval items');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('university_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.university_id) return;

      const { data: complaintsData } = await supabase
        .from('complaints')
        .select('*')
        .eq('university_id', profile.university_id)
        .order('created_at', { ascending: false });

      setComplaints(complaintsData || []);

      // Update stats
      const totalComplaints = complaintsData?.length || 0;
      const resolvedComplaints = complaintsData?.filter(c => c.status === 'resolved').length || 0;

      setStats(prev => ({
        ...prev,
        totalComplaints,
        resolvedComplaints
      }));

    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('university_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.university_id) return;

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('university_id', profile.university_id);

      setStats(prev => ({
        ...prev,
        totalUsers: totalUsers || 0
      }));

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApprovalItems();
      fetchComplaints();
      fetchStats();
    }
  }, [user]);

  const handleComplaintUpdate = () => {
    fetchComplaints();
  };

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
          <AdminStats stats={stats} />
          <ApprovalQueue items={approvalItems} onApprovalChange={fetchApprovalItems} />
        </div>
        
        <div className="space-y-6">
          <ComplaintsManager complaints={complaints} onComplaintUpdate={handleComplaintUpdate} />
          <NotificationManager />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
