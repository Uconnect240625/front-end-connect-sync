
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ProfileDebugger = () => {
  const { user, profile, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Get total users count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get universities count
        const { count: universityCount } = await supabase
          .from('universities')
          .select('*', { count: 'exact', head: true });

        setDebugInfo({
          userCount,
          universityCount,
          currentUser: user?.id,
          currentProfile: profile?.id,
          hasProfile: !!profile
        });
      } catch (error) {
        console.error('Debug info fetch error:', error);
      }
    };

    if (!loading) {
      fetchDebugInfo();
    }
  }, [user, profile, loading]);

  if (loading) {
    return <div className="p-4 bg-blue-50 rounded-lg">Loading auth state...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Profile System Debug Info</h3>
      <div className="space-y-1">
        <div>Total Profiles: {debugInfo?.userCount ?? 'Loading...'}</div>
        <div>Total Universities: {debugInfo?.universityCount ?? 'Loading...'}</div>
        <div>Current User ID: {debugInfo?.currentUser ?? 'Not logged in'}</div>
        <div>Has Profile: {debugInfo?.hasProfile ? 'Yes' : 'No'}</div>
        <div>Profile Role: {profile?.role ?? 'N/A'}</div>
        <div>Profile University: {profile?.university_id ?? 'N/A'}</div>
      </div>
    </div>
  );
};

export default ProfileDebugger;
