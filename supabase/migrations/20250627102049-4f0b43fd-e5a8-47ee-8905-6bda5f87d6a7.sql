
-- Create RLS policy to allow admins to delete complaints from their university
CREATE POLICY "Admins can delete complaints from their university"
ON public.complaints
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND university_id = complaints.university_id
  )
);

-- Update storage policies for complaint-files bucket to allow admin deletion
CREATE POLICY "Allow admins to delete complaint files from their university"
ON storage.objects 
FOR DELETE
USING (
  bucket_id = 'complaint-files' AND 
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.complaints c ON c.file_url LIKE '%' || name || '%'
    WHERE p.id = auth.uid() 
    AND p.role = 'admin' 
    AND p.university_id = c.university_id
  )
);
