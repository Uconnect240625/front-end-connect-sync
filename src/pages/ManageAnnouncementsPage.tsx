
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import ManageAnnouncements from '@/components/announcements/ManageAnnouncements';

const ManageAnnouncementsPage = () => {
  const { user, profile } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only admins and clubs can manage announcements
  if (!profile || (profile.role !== 'admin' && profile.role !== 'club')) {
    return <Navigate to="/announcements" replace />;
  }

  return <ManageAnnouncements />;
};

export default ManageAnnouncementsPage;
