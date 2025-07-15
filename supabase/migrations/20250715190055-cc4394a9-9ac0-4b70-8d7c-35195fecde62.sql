-- Create policy for admins to update approval status of marketplace items
CREATE POLICY "Admins can update approval status of marketplace items" 
ON public.marketplace_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin' 
    AND profiles.university_id = marketplace_items.university_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin' 
    AND profiles.university_id = marketplace_items.university_id
  )
);