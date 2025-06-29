
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Send, Users, User } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  user_id: string | null;
  university_id: string;
}

const NotificationManager = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    targetType: 'broadcast' // 'broadcast' or 'individual'
  });

  useEffect(() => {
    if (profile?.university_id) {
      fetchNotifications();
    }
  }, [profile?.university_id]);

  const fetchNotifications = async () => {
    if (!profile?.university_id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('university_id', profile.university_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.university_id) return;

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        university_id: profile.university_id,
        user_id: formData.targetType === 'broadcast' ? null : null, // For now, only broadcast
        is_read: false
      };

      const { error } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification created successfully"
      });

      setFormData({
        title: '',
        message: '',
        type: 'general',
        targetType: 'broadcast'
      });
      setShowCreateForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'academic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Notification Management</h2>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Create Notification
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Create New Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div>
                <Input
                  placeholder="Notification Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Notification Message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={formData.targetType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broadcast">All Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Send size={16} />
                  Send Notification
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No notifications found. Create your first notification!</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-card-foreground mb-2">
                      {notification.title}
                    </CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {notification.user_id ? (
                          <><User size={12} className="mr-1" />Individual</>
                        ) : (
                          <><Users size={12} className="mr-1" />Broadcast</>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{notification.message}</p>
                <span className="text-sm text-muted-foreground">
                  📅 {formatDate(notification.created_at)}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
