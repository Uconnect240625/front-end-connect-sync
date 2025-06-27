
import React from 'react';
import Navigation from '@/components/Navigation';
import { NotesHub as NotesHubComponent } from '@/components/notes/NotesHub';

const NotesHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-4">
        <NotesHubComponent />
      </div>
    </div>
  );
};

export default NotesHub;
