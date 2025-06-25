
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
  const { user, profile } = useAuth();
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
    if (profile) {
      fetchExistingSubjects();
    }
  }, [profile]);

  const fetchExistingSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('subject')
        .eq('university_id', profile?.university_id);

      if (error) throw error;
      
      const subjects = [...new Set(data?.map(note => note.subject) || [])];
      setExistingSubjects(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
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
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to upload notes",
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

      if (dbError) throw dbError;

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
        description: "Failed to upload notes. Please try again.",
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
