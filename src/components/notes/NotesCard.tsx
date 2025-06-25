
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Heart, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
  onUpdate: () => void;
}

export const NotesCard: React.FC<NotesCardProps> = ({ note, onUpdate }) => {
  const { toast } = useToast();

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
      const fileName = note.file_url.split('/').pop() || 'note.pdf';
      
      const { data, error } = await supabase.storage
        .from('notes')
        .download(fileName);

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
          <Badge variant="secondary">{note.subject}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} />
          {format(new Date(note.created_at), 'MMM d, yyyy')}
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className="flex items-center gap-1"
          >
            <Heart size={14} />
            {note.likes_count}
          </Button>
          
          {note.file_url && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download size={14} />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
