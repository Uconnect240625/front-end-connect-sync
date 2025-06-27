
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Building, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

interface PGListing {
  id: string;
  name: string;
  location: string;
  price: number;
  sharing_type: string;
  facilities: string;
  contact_number: string;
  owner_name: string;
  created_at: string;
}

interface RoommateRequest {
  id: string;
  requester_name: string;
  gender: string;
  budget: number;
  location: string;
  preferences: string;
  contact_number: string;
  created_at: string;
}

const PGFinder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [pgListings, setPgListings] = useState<PGListing[]>([]);
  const [roommateRequests, setRoommateRequests] = useState<RoommateRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.university_id) {
      fetchData();
    }
  }, [profile?.university_id]);

  const fetchData = async () => {
    if (!profile?.university_id) return;

    try {
      const [pgResponse, roommateResponse] = await Promise.all([
        supabase
          .from('pg_listings')
          .select('*')
          .eq('university_id', profile.university_id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false }),
        supabase
          .from('roommate_requests')
          .select('*')
          .eq('university_id', profile.university_id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
      ]);

      if (pgResponse.error) throw pgResponse.error;
      if (roommateResponse.error) throw roommateResponse.error;

      setPgListings(pgResponse.data || []);
      setRoommateRequests(roommateResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PG listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <button
          onClick={() => navigate('/uconnect')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to U Connect
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-foreground">🏠 PG & Roommate Finder</h1>
          </div>
        </div>

        <Tabs defaultValue="pg-listings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="pg-listings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              PG Listings
            </TabsTrigger>
            <TabsTrigger value="roommate-requests" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Roommate Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pg-listings" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => navigate('/post-roommate-request')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={16} className="mr-1" />
                Post Request
              </Button>
            </div>

            {pgListings.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">No PG Listings Available</h3>
                <p className="text-muted-foreground">Check back later for new listings!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pgListings.map((pg) => (
                  <div key={pg.id} className="bg-card rounded-xl shadow-lg p-6 border border-border hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg text-card-foreground">{pg.name}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">PG Listing</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong className="text-card-foreground">Location:</strong> <span className="text-muted-foreground">{pg.location}</span></p>
                      <p><strong className="text-card-foreground">Price:</strong> <span className="text-green-600 font-semibold">{formatPrice(pg.price)}/month</span></p>
                      <p><strong className="text-card-foreground">Type:</strong> <span className="text-muted-foreground">{pg.sharing_type}</span></p>
                      <p><strong className="text-card-foreground">Facilities:</strong> <span className="text-muted-foreground">{pg.facilities}</span></p>
                      <p><strong className="text-card-foreground">Owner:</strong> <span className="text-muted-foreground">{pg.owner_name}</span></p>
                      <p><strong className="text-card-foreground">Contact:</strong> <span className="text-muted-foreground">{pg.contact_number}</span></p>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        toast({
                          title: "Contact Information",
                          description: `Contact ${pg.owner_name} at ${pg.contact_number}`,
                        });
                      }}
                    >
                      Contact Owner
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="roommate-requests" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => navigate('/post-roommate-request')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={16} className="mr-1" />
                Post Request
              </Button>
            </div>

            {roommateRequests.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <div className="text-6xl mb-4">🧑‍🤝‍🧑</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">No Roommate Requests</h3>
                <p className="text-muted-foreground">Be the first to post a roommate request!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roommateRequests.map((request) => (
                  <div key={request.id} className="bg-card rounded-xl shadow-lg p-6 border border-border hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg text-card-foreground">🧑‍🤝‍🧑 Roommate Needed</h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Roommate Request</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong className="text-card-foreground">From:</strong> <span className="text-muted-foreground">{request.requester_name}</span></p>
                      <p><strong className="text-card-foreground">Gender:</strong> <span className="text-muted-foreground capitalize">{request.gender}</span></p>
                      <p><strong className="text-card-foreground">Budget:</strong> <span className="text-green-600 font-semibold">{formatPrice(request.budget)}/month</span></p>
                      <p><strong className="text-card-foreground">Location:</strong> <span className="text-muted-foreground">{request.location}</span></p>
                      <p><strong className="text-card-foreground">Preferences:</strong> <span className="text-muted-foreground">{request.preferences || 'None specified'}</span></p>
                      <p><strong className="text-card-foreground">Contact:</strong> <span className="text-muted-foreground">{request.contact_number}</span></p>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        toast({
                          title: "Contact Information",
                          description: `Contact ${request.requester_name} at ${request.contact_number}`,
                        });
                      }}
                    >
                      Contact Person
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PGFinder;
