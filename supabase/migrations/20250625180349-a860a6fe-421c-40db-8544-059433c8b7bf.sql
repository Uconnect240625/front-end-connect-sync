
-- Add DELETE policy for notes table to allow users to delete their own notes
CREATE POLICY "Users can delete their own notes" 
  ON public.notes 
  FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

-- Verify and update storage policies for notes bucket (if needed)
-- These policies should already exist but let's ensure they're correct

-- Policy to allow users to delete their own files from notes storage
DROP POLICY IF EXISTS "Users can delete their own notes" ON storage.objects;
CREATE POLICY "Users can delete their own notes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
