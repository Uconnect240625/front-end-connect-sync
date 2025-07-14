
-- Allow admins to delete roommate requests from their university
CREATE POLICY "Admins can delete roommate requests from their university" 
ON public.roommate_requests 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role 
    AND profiles.university_id = roommate_requests.university_id
  )
);
