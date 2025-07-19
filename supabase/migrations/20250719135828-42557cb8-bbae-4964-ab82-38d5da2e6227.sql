
-- Add RLS policy for admins to update club events for approval
CREATE POLICY "Admins can update club events for approval" 
ON public.club_events 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin' 
    AND profiles.university_id = club_events.university_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin' 
    AND profiles.university_id = club_events.university_id
  )
);
