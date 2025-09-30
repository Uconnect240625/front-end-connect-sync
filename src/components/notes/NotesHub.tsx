
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrowseNotes } from './BrowseNotes';
import { UploadNotesForm } from './UploadNotesForm';
import { MyNotes } from './MyNotes';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotesHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-primary hover:text-primary/80 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to U Connect
          </button>
          
          <h1 className="text-2xl font-bold text-center mb-6 text-foreground">📚 U Connect Notes Hub</h1>

          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Notes</TabsTrigger>
              <TabsTrigger value="my-notes">My Notes</TabsTrigger>
              <TabsTrigger value="upload">Upload Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-6">
              <BrowseNotes />
            </TabsContent>
            
            <TabsContent value="my-notes" className="mt-6">
              <MyNotes />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-6">
              <UploadNotesForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
