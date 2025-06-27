
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    content: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to create announcements",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.type || !formData.category || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check permissions
    const canCreateOfficial = profile.role === 'admin';
    const canCreateStudent = profile.role === 'admin' || profile.role === 'club';
    
    if (formData.type === 'Official' && !canCreateOfficial) {
      toast({
        title: "Error",
        description: "Only admins can create official announcements",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'Student' && !canCreateStudent) {
      toast({
        title: "Error",
        description: "Only admins and clubs can create student announcements",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('announcements')
        .insert([{
          title: formData.title,
          type: formData.type,
          category: formData.category,
          content: formData.content,
          user_id: user.id,
          university_id: profile.university_id
        }]);

      if (error) {
        console.error('Error creating announcement:', error);
        toast({
          title: "Error",
          description: "Failed to create announcement. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Announcement created successfully!"
      });

      navigate('/announcements');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Announcement</CardTitle>
            <CardDescription>
              Share important updates with the university community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select announcement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Official">🏛️ Official</SelectItem>
                    <SelectItem value="Student">🎓 Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exams">Exams</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="Club Event">Club Event</SelectItem>
                    <SelectItem value="Lost & Found">Lost & Found</SelectItem>
                    <SelectItem value="Academics">Academics</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Description *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter announcement description..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Creating...' : 'Create Announcement'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/announcements')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementForm;
