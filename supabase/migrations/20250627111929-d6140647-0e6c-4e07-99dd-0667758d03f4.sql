
-- Enable RLS on announcements table
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy for users to view all announcements (everyone can read)
CREATE POLICY "Anyone can view announcements" 
ON public.announcements 
FOR SELECT 
USING (true);

-- Policy for admins and clubs to create announcements
CREATE POLICY "Admins and clubs can create announcements" 
ON public.announcements 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  public.get_user_role() IN ('admin', 'club')
);

-- Policy for users to update their own announcements (only admins and clubs)
CREATE POLICY "Users can update their own announcements" 
ON public.announcements 
FOR UPDATE 
USING (
  auth.uid() = user_id AND
  public.get_user_role() IN ('admin', 'club')
);

-- Policy for users to delete their own announcements (only admins and clubs)
CREATE POLICY "Users can delete their own announcements" 
ON public.announcements 
FOR DELETE 
USING (
  auth.uid() = user_id AND
  public.get_user_role() IN ('admin', 'club')
);

-- Additional policy for admins to delete any announcement
CREATE POLICY "Admins can delete any announcement" 
ON public.announcements 
FOR DELETE 
USING (public.get_user_role() = 'admin');
