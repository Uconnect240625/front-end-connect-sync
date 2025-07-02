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
  title: string;
  location: string;
  price: number;
  type: string;
  description: string;
  contact_phone: string;
  created_at: string;
}
const PGFinder = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    profile
  } = useAuth();
  const [pgListings, setPgListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (profile?.university_id) {
      fetchData();
    }
  }, [profile?.university_id]);
  const fetchData = async () => {
    if (!profile?.university_id) return;
    try {
      const {
        data: pgResponse,
        error: pgError
      } = await supabase.from('pg_listings').select('*').eq('university_id', profile.university_id).eq('approval_status', 'approved').order('created_at', {
        ascending: false
      });
      if (pgError) throw pgError;
      setPgListings(pgResponse || []);
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
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PG listings...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <button onClick={() => navigate('/uconnect')} className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft size={20} />
          Back to U Connect
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            
            <h1 className="font-bold text-foreground text-2xl">🏠 PG & Roommate Finder</h1>
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
            {pgListings.length === 0 ? <div className="text-center py-12 bg-card rounded-xl border border-border">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">No PG Listings Available</h3>
                <p className="text-muted-foreground">Check back later for new listings!</p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pgListings.map(pg => <div key={pg.id} className="bg-card rounded-xl shadow-lg p-6 border border-border hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg text-card-foreground">{pg.title}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">PG Listing</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong className="text-card-foreground">Location:</strong> <span className="text-muted-foreground">{pg.location}</span></p>
                      <p><strong className="text-card-foreground">Price:</strong> <span className="text-green-600 font-semibold">{formatPrice(pg.price)}/month</span></p>
                      <p><strong className="text-card-foreground">Type:</strong> <span className="text-muted-foreground">{pg.type}</span></p>
                      <p><strong className="text-card-foreground">Description:</strong> <span className="text-muted-foreground">{pg.description}</span></p>
                      <p><strong className="text-card-foreground">Contact:</strong> <span className="text-muted-foreground">{pg.contact_phone}</span></p>
                    </div>
                    
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                toast({
                  title: "Contact Information",
                  description: `Contact owner at ${pg.contact_phone}`
                });
              }}>
                      Contact Owner
                    </Button>
                  </div>)}
              </div>}
          </TabsContent>

          <TabsContent value="roommate-requests" className="mt-6">
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <div className="text-6xl mb-4">🧑‍🤝‍🧑</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Roommate Requests Coming Soon</h3>
              <p className="text-muted-foreground">This feature will be available soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default PGFinder;