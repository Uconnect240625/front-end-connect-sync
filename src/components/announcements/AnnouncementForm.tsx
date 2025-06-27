
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['official', 'student']),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

const AnnouncementForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      type: 'official',
      category: '',
      content: '',
    },
  });

  const onSubmit = async (data: AnnouncementFormData) => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to create announcements",
        variant: "destructive"
      });
      return;
    }

    console.log('Submitting announcement with data:', data);
    console.log('User ID:', user.id);
    console.log('Profile:', profile);

    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: data.title,
          type: data.type,
          category: data.category,
          content: data.content,
          user_id: user.id,
          university_id: profile.university_id,
        });

      if (error) {
        console.error('Error creating announcement:', error);
        toast({
          title: "Error",
          description: "Failed to create announcement",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Announcement created successfully"
      });

      navigate('/announcements');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter announcement title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select announcement type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="official">🏛️ Official</SelectItem>
                          <SelectItem value="student">🎓 Student</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Exams">📝 Exams</SelectItem>
                          <SelectItem value="Holiday">🎉 Holiday</SelectItem>
                          <SelectItem value="Club Event">🎭 Club Event</SelectItem>
                          <SelectItem value="Lost & Found">🔍 Lost & Found</SelectItem>
                          <SelectItem value="Academics">📚 Academics</SelectItem>
                          <SelectItem value="Emergency">🚨 Emergency</SelectItem>
                          <SelectItem value="General">📋 General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter announcement content"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Create Announcement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/announcements')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementForm;
