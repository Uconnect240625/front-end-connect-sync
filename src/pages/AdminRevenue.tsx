
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminRevenue = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState({
    clubEventFees: 0,
    marketplaceCommission: 0,
    pgListingFees: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    if (profile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    loadRevenueData();
  }, [profile, navigate]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);

      // Fetch paid items from different tables
      const [pgListings, marketplaceItems, clubEvents] = await Promise.all([
        supabase
          .from('pg_listings')
          .select('id')
          .eq('university_id', profile?.university_id)
          .eq('is_paid', true),
        
        supabase
          .from('marketplace_items')
          .select('id')
          .eq('university_id', profile?.university_id)
          .eq('is_paid', true),
        
        supabase
          .from('club_events')
          .select('id')
          .eq('university_id', profile?.university_id)
          .eq('is_paid', true)
      ]);

      // Calculate revenue (₹50 per paid item)
      const clubEventFees = (clubEvents.data?.length || 0) * 50;
      const marketplaceCommission = (marketplaceItems.data?.length || 0) * 50;
      const pgListingFees = (pgListings.data?.length || 0) * 50;
      const total = clubEventFees + marketplaceCommission + pgListingFees;

      setRevenueData({
        clubEventFees,
        marketplaceCommission,
        pgListingFees,
        total
      });

    } catch (error) {
      console.error('Error loading revenue data:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    toast.success('Withdraw request submitted! Processing may take 2-3 business days.');
  };

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-red-600">Admin Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-600 text-white p-5 rounded-xl text-center">
              <h3 className="text-lg mb-2">Total Collected</h3>
              <p className="text-3xl font-bold">₹{revenueData.total.toLocaleString()}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Breakdown</h4>
              
              <div className="bg-gray-100 p-3 rounded-lg flex justify-between mb-2">
                <span>Club Event Fees</span>
                <span className="font-semibold">₹{revenueData.clubEventFees.toLocaleString()}</span>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg flex justify-between mb-2">
                <span>Marketplace Commission</span>
                <span className="font-semibold">₹{revenueData.marketplaceCommission.toLocaleString()}</span>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
                <span>PG Listing Fees</span>
                <span className="font-semibold">₹{revenueData.pgListingFees.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              onClick={handleWithdraw}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Withdraw to Bank
            </Button>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Note:</strong> Revenue is calculated based on paid submissions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Club Event Posting: ₹50 per event</li>
                <li>Marketplace Listings: ₹50 per item</li>
                <li>PG Listings: ₹50 per listing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRevenue;
