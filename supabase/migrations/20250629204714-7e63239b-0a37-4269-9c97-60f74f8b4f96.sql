
-- First, let's ensure the notifications table has proper RLS policies and university support
-- Add university_id to notifications table if it doesn't exist
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS university_id uuid REFERENCES public.universities(id);

-- Update existing notifications to have a default university (first one available)
UPDATE public.notifications 
SET university_id = (SELECT id FROM public.universities ORDER BY created_at LIMIT 1)
WHERE university_id IS NULL;

-- Make university_id NOT NULL after updating existing records
ALTER TABLE public.notifications ALTER COLUMN university_id SET NOT NULL;

-- Add type column for notification categories
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type text DEFAULT 'general';

-- Drop existing RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Create new RLS policies for notifications
CREATE POLICY "Users can view notifications from their university"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Admins can insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Admins can update notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Admins can delete notifications"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Users can update their own notification read status"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
