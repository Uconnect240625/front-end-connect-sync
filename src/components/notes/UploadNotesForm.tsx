
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';

const uploadFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  file: z.any().refine((files) => files?.length === 1, 'PDF file is required')
    .refine((files) => files?.[0]?.type === 'application/pdf', 'Only PDF files are allowed')
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, 'File size must be less than 10MB'),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

export const UploadNotesForm = () => {
  const [existingSubjects, setExistingSubjects] = useState<string[]>([]);
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      tags: '',
    },
  });

  useEffect(() => {
    console.log('UploadNotesForm - Auth state:', { user: !!user, profile: !!profile, loading });
    
    // Only fetch subjects if we have both user and profile
    if (user && profile && profile.university_id) {
      console.log('Fetching subjects for university:', profile.university_id);
      fetchExistingSubjects();
    }
  }, [user, profile, loading]);

  const fetchExistingSubjects = async () => {
    if (!profile?.university_id) {
      console.log('No university_id in profile, skipping subject fetch');
      return;
    }

    try {
      console.log('Fetching subjects for university:', profile.university_id);
      const { data, error } = await supabase
        .from('notes')
        .select('subject')
        .eq('university_id', profile.university_id);

      if (error) {
        console.error('Error fetching subjects:', error);
        return;
      }
      
      const subjects = [...new Set(data?.map(note => note.subject) || [])];
      console.log('Fetched subjects:', subjects);
      setExistingSubjects(subjects);
    } catch (error) {
      console.error('Error in fetchExistingSubjects:', error);
    }
  };

  const uploadFile = async (file: File, fileName: string): Promise<string> => {
    const filePath = `${user?.id}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('notes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('notes')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const onSubmit = async (data: UploadFormData) => {
    console.log('Upload attempt - Auth state:', { 
      user: !!user, 
      profile: !!profile, 
      university_id: profile?.university_id 
    });
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload notes. Please sign in and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!profile || !profile.university_id) {
      toast({
        title: "Profile Error", 
        description: "Your profile could not be loaded or is missing university information. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Generate unique filename
      const file = data.file[0];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      setUploadProgress(30);

      // Upload file to storage
      const fileUrl = await uploadFile(file, fileName);
      
      setUploadProgress(60);

      // Process tags
      const tags = data.tags ? 
        data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : 
        null;

      console.log('Inserting note with data:', {
        user_id: user.id,
        university_id: profile.university_id,
        title: data.title,
        subject: data.subject,
        file_url: fileUrl,
        tags: tags,
      });

      // Save note metadata to database
      const { error: dbError } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          university_id: profile.university_id,
          title: data.title,
          subject: data.subject,
          file_url: fileUrl,
          tags: tags,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Notes uploaded successfully!",
      });

      // Reset form
      form.reset();
      setIsCustomSubject(false);
      fetchExistingSubjects();

    } catch (error) {
      console.error('Error uploading note:', error);
      toast({
        title: "Error",
        description: `Failed to upload notes: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubjectChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomSubject(true);
      form.setValue('subject', '');
    } else {
      setIsCustomSubject(false);
      form.setValue('subject', value);
    }
  };

  const handleCustomSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('subject', e.target.value);
  };

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth error if user is not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p className="text-red-600 mb-4">You must be logged in to upload notes.</p>
        <Button onClick={() => window.location.href = '/auth'}>
          Go to Login
        </Button>
      </div>
    );
  }

  // Show profile error if profile is not loaded
  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p className="text-red-600 mb-4">Unable to load your profile. Please try refreshing the page.</p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  // Show university error if profile doesn't have university_id
  if (!profile.university_id) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p className="text-red-600 mb-4">Your profile is missing university information. Please contact support.</p>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter note title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {!isCustomSubject ? (
                      <Select onValueChange={handleSubjectChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or add a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingSubjects.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">+ Add new subject</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter new subject"
                          value={field.value}
                          onChange={handleCustomSubjectChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsCustomSubject(false);
                            form.setValue('subject', '');
                          }}
                        >
                          Choose from existing subjects
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of the notes..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter tags separated by commas (e.g., important, exam, chapter1)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Upload PDF File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Notes
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
