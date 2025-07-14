
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import RoommateRequestForm from '@/components/RoommateRequestForm';
import PGListingForm from '@/components/admin/PGListingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PostRoommateRequest = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">PG & Roommate Services</h1>
          <p className="text-muted-foreground">Find roommates or list PG accommodations</p>
        </div>

        <Tabs defaultValue="roommate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roommate">Post Roommate Request</TabsTrigger>
            <TabsTrigger value="pg" disabled={profile?.role !== 'admin'}>
              List PG {profile?.role !== 'admin' && '(Admin Only)'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roommate">
            <RoommateRequestForm />
          </TabsContent>

          <TabsContent value="pg">
            <PGListingForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PostRoommateRequest;
