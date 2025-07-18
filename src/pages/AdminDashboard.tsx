import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AdminStats from '@/components/admin/AdminStats';
import ApprovalQueue from '@/components/admin/ApprovalQueue';
import ComplaintsManager from '@/components/admin/ComplaintsManager';
import NotificationManager from '@/components/admin/NotificationManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, DollarSign, UtensilsCrossed, Users, FileText, Building, Calendar, ShoppingBag, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingComplaints: 0,
    totalNotifications: 0
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
      
      console.log('Loading dashboard data for university:', profile?.university_id);
      
      // Load pending approvals from all tables with complete field sets
      const [pgListings, marketplaceItems, clubEvents, roommateRequests, complaintsData, notificationsData] = await Promise.all([
        supabase
          .from('pg_listings')
          .select('id, title, description, price, location, contact_phone, type as pg_type, is_paid, approval_status, created_at, user_id, university_id')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        supabase
          .from('marketplace_items')
          .select('id, title, description, price, category, contact_phone, image_urls, is_paid, approval_status, created_at, user_id, university_id')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        supabase
          .from('club_events')
          .select('id, title, description, event_date, event_time, location, club_id, is_paid, approval_status, created_at, university_id')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        supabase
          .from('roommate_requests')
          .select('id, requester_name, gender, budget, location, contact_number, preferences, approval_status, created_at, user_id, university_id')
          .eq('university_id', profile?.university_id)
          .eq('approval_status', 'pending'),
        
        // Load all complaints (not just unresolved ones)
        supabase
          .from('complaints')
          .select('*')
          .eq('university_id', profile?.university_id)
          .order('created_at', { ascending: false }),

        // Load notifications count
        supabase
          .from('notifications')
          .select('id')
          .eq('university_id', profile?.university_id)
      ]);

      console.log('PG Listings data:', pgListings.data);
      console.log('Marketplace Items data:', marketplaceItems.data);
      console.log('Club Events data:', clubEvents.data);
      console.log('Roommate Requests data:', roommateRequests.data);

      // Combine approval items with all their details and proper type mapping
      const allApprovalItems = [
        // Handle PG listings with proper type checking
        ...(pgListings.data?.filter(Boolean) || []).map(item => ({
          ...item,
          type: 'pg_listing' as const
        })),
        // Handle marketplace items with proper type checking
        ...(marketplaceItems.data?.filter(Boolean) || []).map(item => ({
          ...item,
          type: 'marketplace_item' as const
        })),
        // Handle club events with proper type checking
        ...(clubEvents.data?.filter(Boolean) || []).map(item => ({
          ...item,
          type: 'club_event' as const,
          is_paid: item.is_paid || false // Ensure is_paid is boolean
        })),
        // Handle roommate requests with proper type checking
        ...(roommateRequests.data?.filter(Boolean) || []).map(item => ({
          ...item,
          type: 'roommate_request' as const,
          title: `Roommate Request by ${item.requester_name}`,
          is_paid: false // Roommate requests don't have payment
        }))
      ];

      console.log('Combined approval items:', allApprovalItems);

      setApprovalItems(allApprovalItems);
      setComplaints(complaintsData.data || []);

      console.log('Loaded complaints:', complaintsData.data);

      // Calculate stats - use is_paid field instead of payment_status
      const paidItems = allApprovalItems.filter(item => item.is_paid === true);
      const totalRevenue = paidItems.length * 50; // Assuming ₹50 per paid item

      // Count pending complaints (not resolved/closed)
      const pendingComplaints = (complaintsData.data || []).filter(
        complaint => complaint.status !== 'resolved' && complaint.status !== 'closed'
      ).length;

      setStats({
        pendingApprovals: allApprovalItems.length,
        totalRevenue,
        activeUsers: 0, // This would need a separate query
        pendingComplaints,
        totalNotifications: notificationsData.data?.length || 0
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage university operations and approvals</p>
        </div>

        <AdminStats stats={stats} />

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow border-border bg-card" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-card-foreground">{action.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="approvals" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Pending Approvals ({stats.pendingApprovals})</TabsTrigger>
            <TabsTrigger value="complaints" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Complaints ({complaints.length})</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Notifications ({stats.totalNotifications})</TabsTrigger>
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

          <TabsContent value="notifications">
            <NotificationManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
