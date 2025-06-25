
-- Create storage bucket for notes files
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true);

-- Create RLS policies for the notes bucket
CREATE POLICY "Authenticated users can upload notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view notes from their university"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'notes');

CREATE POLICY "Users can update their own notes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own notes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
