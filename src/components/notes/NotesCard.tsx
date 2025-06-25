
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Heart, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Note {
  id: string;
  title: string;
  subject: string;
  file_url: string | null;
  likes_count: number;
  created_at: string;
  tags: string[] | null;
  user_id: string;
}

interface NotesCardProps {
  note: Note;
  currentUserId: string;
  onUpdate: () => void;
}

export const NotesCard: React.FC<NotesCardProps> = ({ note, currentUserId, onUpdate }) => {
  const { toast } = useToast();
  const isOwner = note.user_id === currentUserId;

  const handleDownload = async () => {
    if (!note.file_url) {
      toast({
        title: "Error",
        description: "No file available for download",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract the file path from the full URL
      const urlParts = note.file_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${note.user_id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('notes')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleLike = async () => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ likes_count: note.likes_count + 1 })
        .eq('id', note.id);

      if (error) throw error;
      
      onUpdate();
      toast({
        title: "Success",
        description: "Note liked!",
      });
    } catch (error) {
      console.error('Error liking note:', error);
      toast({
        title: "Error",
        description: "Failed to like note",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      // First, delete the file from storage if it exists
      if (note.file_url) {
        const urlParts = note.file_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${note.user_id}/${fileName}`;
        
        const { error: storageError } = await supabase.storage
          .from('notes')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with database deletion even if file deletion fails
        }
      }

      // Delete the note record from database
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)
        .eq('user_id', currentUserId); // Extra security check

      if (error) throw error;
      
      onUpdate();
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 w-full max-w-md mx-auto">
      <CardHeader className="pb-4 space-y-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-semibold leading-tight flex-1 min-h-[3rem] flex items-center">
            {note.title}
          </CardTitle>
          <div className="flex flex-col gap-2 shrink-0">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {note.subject}
            </Badge>
            {isOwner && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                Your note
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-2">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar size={16} />
          <span>{format(new Date(note.created_at), 'MMM d, yyyy')}</span>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Heart size={16} />
            <span>{note.likes_count}</span>
          </Button>
          
          <div className="flex gap-3">
            {note.file_url && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2"
              >
                <Download size={16} />
                Download
              </Button>
            )}
            
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{note.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
