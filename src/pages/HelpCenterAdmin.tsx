
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ComplaintsManager from '@/components/admin/ComplaintsManager';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Complaint } from '@/types/database';

const HelpCenterAdmin = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    
    if (profile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    loadComplaints();
  }, [profile, navigate]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('university_id', profile?.university_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to ensure proper status mapping and provide default priority
      const mappedComplaints = (data || []).map(complaint => ({
        ...complaint,
        priority: 'medium' as const, // Always set default since priority doesn't exist in DB
        // Map database status values to our TypeScript enum
        status: mapDatabaseStatusToComplaintStatus(complaint.status as string)
      }));
      
      setComplaints(mappedComplaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map database status to our TypeScript enum
  const mapDatabaseStatusToComplaintStatus = (dbStatus: string): Complaint['status'] => {
    switch (dbStatus) {
      case 'open':
      case 'pending':
        return 'pending';
      case 'in_progress':
        return 'in_progress';
      case 'closed':
      case 'resolved':
        return 'resolved';
      default:
        return 'pending';
    }
  };

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Help Center Admin</h1>
          <p className="text-gray-600">Manage and resolve student complaints and issues</p>
        </div>

        <ComplaintsManager 
          complaints={complaints} 
          onComplaintUpdate={loadComplaints}
        />
      </div>
    </div>
  );
};

export default HelpCenterAdmin;
