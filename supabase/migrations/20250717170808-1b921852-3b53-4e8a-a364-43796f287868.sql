-- Create policy for admins to delete marketplace items from their university
CREATE POLICY "Admins can delete marketplace items from their university" 
ON public.marketplace_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin' 
    AND profiles.university_id = marketplace_items.university_id
  )
);