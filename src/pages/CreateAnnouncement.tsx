
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AnnouncementForm from '@/components/announcements/AnnouncementForm';

const CreateAnnouncement = () => {
  const { user, profile } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only admins and clubs can create announcements
  if (!profile || (profile.role !== 'admin' && profile.role !== 'club')) {
    return <Navigate to="/announcements" replace />;
  }

  return <AnnouncementForm />;
};

export default CreateAnnouncement;
