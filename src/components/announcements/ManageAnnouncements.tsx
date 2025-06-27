
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Trash2, Plus } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  type: string;
  category: string;
  content: string;
  created_at: string;
}

const ManageAnnouncements = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, type, category, content, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive"
        });
        return;
      }

      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        toast({
          title: "Error",
          description: "Failed to delete announcement",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      });

      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBadgeColor = (type: string) => {
    return type === 'Official' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8 text-muted-foreground">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Manage Announcements</h1>
          <Button onClick={() => navigate('/announcements/create')} className="flex items-center gap-2">
            <Plus size={20} />
            New Announcement
          </Button>
        </div>

        {announcements.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No announcements found. Create your first announcement!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-card-foreground">{announcement.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getBadgeColor(announcement.type)}>
                          {announcement.type}
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          {announcement.category}
                        </Badge>
                      </div>
                    </div>
                    {profile?.role === 'admin' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{announcement.content}</p>
                  <span className="text-sm text-muted-foreground">
                    📅 {formatDate(announcement.created_at)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate('/announcements')} className="border-border hover:bg-accent hover:text-accent-foreground">
            ← Back to Announcements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
