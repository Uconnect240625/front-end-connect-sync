
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
      
      // Map the data to ensure priority field is present with default value
      const complaintsWithPriority = (data || []).map(complaint => ({
        ...complaint,
        priority: complaint.priority || 'medium' // Provide default value if missing
      }));
      
      setComplaints(complaintsWithPriority);
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
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
