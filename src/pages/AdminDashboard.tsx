
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, DollarSign, UtensilsCrossed, Users, FileText, Building, Calendar, ShoppingBag } from 'lucide-react';

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

      // Calculate stats - use is_paid field instead of payment_status
      const paidItems = allApprovalItems.filter(item => item.is_paid === true);
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

  const quickActions = [
    {
      title: 'Analytics Dashboard',
      description: 'View detailed analytics and insights',
      icon: BarChart3,
      action: () => navigate('/admin/analytics'),
      color: 'bg-blue-500'
    },
    {
      title: 'Revenue Management',
      description: 'Track earnings and financial data',
      icon: DollarSign,
      action: () => navigate('/admin/revenue'),
      color: 'bg-green-500'
    },
    {
      title: 'Manage Mess Menu',
      description: 'Update weekly mess menu',
      icon: UtensilsCrossed,
      action: () => navigate('/mess-menu-admin'),
      color: 'bg-orange-500'
    }
  ];

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

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approvals">Pending Approvals ({stats.pendingApprovals})</TabsTrigger>
            <TabsTrigger value="complaints">Complaints ({stats.pendingComplaints})</TabsTrigger>
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
