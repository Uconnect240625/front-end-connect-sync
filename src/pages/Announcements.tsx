
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Announcement {
  id: string;
  title: string;
  type: string;
  category: string;
  content: string;
  created_at: string;
}

const Announcements = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('official');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Exams': 'bg-red-100 text-red-800',
      'Holiday': 'bg-green-100 text-green-800',
      'Club Event': 'bg-blue-100 text-blue-800',
      'Lost & Found': 'bg-yellow-100 text-yellow-800',
      'Academics': 'bg-purple-100 text-purple-800',
      'Emergency': 'bg-red-100 text-red-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.type === activeTab.toLowerCase()
  );

  const canManage = profile && (profile.role === 'admin' || profile.role === 'club');

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8 text-foreground">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigate('/uconnect')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to U Connect
            </button>
            {canManage && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/announcements/manage')}
                >
                  <Settings size={16} className="mr-1" />
                  Manage
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/announcements/create')}
                >
                  <Plus size={16} className="mr-1" />
                  Create
                </Button>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-semibold text-foreground">📣 Announcements</h2>
        </header>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'official'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setActiveTab('official')}
          >
            🏛️ Official
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setActiveTab('student')}
          >
            🎓 Student
          </button>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No {activeTab.toLowerCase()} announcements found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="bg-card rounded-xl p-6 shadow-sm transition-transform hover:scale-105">
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">{announcement.title}</h3>
                <Badge className={getBadgeColor(announcement.category)} variant="secondary">
                  {announcement.category}
                </Badge>
                <p className="text-muted-foreground mb-3 mt-3">{announcement.content}</p>
                <span className="text-sm text-muted-foreground">📅 {formatDate(announcement.created_at)}</span>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
