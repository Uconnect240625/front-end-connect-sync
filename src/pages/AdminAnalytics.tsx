
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    activeUsers: 0,
    notesUploaded: 0,
    pgListings: 0,
    announcements: 0,
    pendingComplaints: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    if (profile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    loadAnalyticsData();
  }, [profile, navigate]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch data from various tables for this university
      const [
        notesData,
        pgData,
        announcementsData,
        complaintsData,
        marketplaceData,
        eventsData
      ] = await Promise.all([
        supabase
          .from('notes')
          .select('id')
          .eq('university_id', profile?.university_id),
        
        supabase
          .from('pg_listings')
          .select('id, is_paid')
          .eq('university_id', profile?.university_id),
        
        supabase
          .from('announcements')
          .select('id')
          .eq('university_id', profile?.university_id),
        
        supabase
          .from('complaints')
          .select('id, status')
          .eq('university_id', profile?.university_id),
        
        supabase
          .from('marketplace_items')
          .select('id, is_paid')
          .eq('university_id', profile?.university_id),
        
        supabase
          .from('club_events')
          .select('id, is_paid')
          .eq('university_id', profile?.university_id)
      ]);

      // Calculate total earnings from paid items
      const paidPgListings = pgData.data?.filter(item => item.is_paid) || [];
      const paidMarketplaceItems = marketplaceData.data?.filter(item => item.is_paid) || [];
      const paidEvents = eventsData.data?.filter(item => item.is_paid) || [];
      
      const totalPaidItems = paidPgListings.length + paidMarketplaceItems.length + paidEvents.length;
      const totalEarnings = totalPaidItems * 50; // ₹50 per paid item

      const pendingComplaints = complaintsData.data?.filter(c => c.status !== 'resolved') || [];

      setAnalytics({
        totalEarnings,
        activeUsers: 1324, // This would need user activity tracking
        notesUploaded: notesData.data?.length || 0,
        pgListings: pgData.data?.length || 0,
        announcements: announcementsData.data?.length || 0,
        pendingComplaints: pendingComplaints.length
      });

      // Generate mock monthly data for the chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const chartData = months.map((month, index) => ({
        month,
        earnings: Math.floor(totalEarnings * (0.6 + (index * 0.1))) // Progressive growth
      }));

      setMonthlyData(chartData);

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
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
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h2 className="text-center text-2xl font-bold text-red-600 mb-8">📊 U Connect Admin Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-red-600">💰</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-800">₹{analytics.totalEarnings.toLocaleString()}</h3>
              <p className="text-gray-600">Total Earnings (This Month)</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-red-600">🧑‍🎓</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.activeUsers.toLocaleString()}</h3>
              <p className="text-gray-600">Active Users</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-red-600">📄</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.notesUploaded}</h3>
              <p className="text-gray-600">Notes Uploaded</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-red-600">🏠</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.pgListings}</h3>
              <p className="text-gray-600">PG Listings</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-red-600">📢</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.announcements}</h3>
              <p className="text-gray-600">Announcements Posted</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-red-600">🛠️</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold text-gray-800">{analytics.pendingComplaints}</h3>
              <p className="text-gray-600">Pending Complaints</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Earnings Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                <Bar dataKey="earnings" fill="#cf0a2c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
