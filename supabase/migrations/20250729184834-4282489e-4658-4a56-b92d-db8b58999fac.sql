
-- Create messages table for community chat
CREATE TABLE public.community_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id uuid NOT NULL,
  message text,
  file_url text,
  file_name text,
  file_type text,
  file_size bigint,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on community messages
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages from their university
CREATE POLICY "Users can view messages from their university"
  ON public.community_messages
  FOR SELECT
  USING (university_id = get_user_university_id());

-- Users can create messages for their university
CREATE POLICY "Users can create messages for their university"
  ON public.community_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND 
    university_id = get_user_university_id()
  );

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
  ON public.community_messages
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
  ON public.community_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for community files
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-files', 'community-files', true);

-- Create storage policies for community files
CREATE POLICY "Users can view community files from their university"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'community-files' AND
    (storage.foldername(name))[1] = get_user_university_id()::text
  );

CREATE POLICY "Users can upload community files to their university folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'community-files' AND
    auth.uid()::text = (storage.foldername(name))[2] AND
    (storage.foldername(name))[1] = get_user_university_id()::text
  );

CREATE POLICY "Users can update their own community files"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'community-files' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "Users can delete their own community files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'community-files' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Enable realtime for community messages
ALTER TABLE public.community_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;
