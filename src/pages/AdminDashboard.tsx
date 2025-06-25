
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AdminStats from '@/components/admin/AdminStats';
import ApprovalQueue from '@/components/admin/ApprovalQueue';
import ComplaintsManager from '@/components/admin/ComplaintsManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingComplaints: 0
  });
  const [approvalItems, setApprovalItems] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    if (profile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [profile, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load pending approvals from all tables
      const [pgListings, marketplaceItems, clubEvents, complaintsData] = await Promise.all([
        supabase
          .from('pg_listings')
          .select('*')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        supabase
          .from('marketplace_items')
          .select('*')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        supabase
          .from('club_events')
          .select('*')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        supabase
          .from('complaints')
          .select('*')
          .eq('university_id', profile?.university_id)
          .neq('status', 'resolved')
      ]);

      // Combine approval items
      const allApprovalItems = [
        ...(pgListings.data || []).map(item => ({
          ...item,
          type: 'pg_listing' as const
        })),
        ...(marketplaceItems.data || []).map(item => ({
          ...item,
          type: 'marketplace_item' as const
        })),
        ...(clubEvents.data || []).map(item => ({
          ...item,
          type: 'club_event' as const
        }))
      ];

      setApprovalItems(allApprovalItems);
      setComplaints(complaintsData.data || []);

      // Calculate stats
      const paidItems = allApprovalItems.filter(item => item.payment_status === 'paid');
      const totalRevenue = paidItems.length * 50; // Assuming ₹50 per paid item

      setStats({
        pendingApprovals: allApprovalItems.length,
        totalRevenue,
        activeUsers: 0, // This would need a separate query
        pendingComplaints: complaintsData.data?.length || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage university operations and approvals</p>
        </div>

        <AdminStats stats={stats} />

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals">
            <ApprovalQueue 
              items={approvalItems} 
              onApprovalChange={loadDashboardData}
            />
          </TabsContent>

          <TabsContent value="complaints">
            <ComplaintsManager 
              complaints={complaints} 
              onComplaintUpdate={loadDashboardData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
