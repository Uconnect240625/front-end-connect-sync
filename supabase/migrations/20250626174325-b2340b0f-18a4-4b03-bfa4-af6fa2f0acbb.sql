
-- Create storage bucket for complaint files
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-files', 'complaint-files', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload complaint files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'complaint-files' AND auth.role() = 'authenticated');

-- Create policy to allow public access to read files
CREATE POLICY "Allow public access to read complaint files"
ON storage.objects FOR SELECT
USING (bucket_id = 'complaint-files');

-- Create policy to allow authenticated users to delete their own files or admins to delete any
CREATE POLICY "Allow users to delete complaint files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'complaint-files' AND 
  (auth.uid() = owner OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);
