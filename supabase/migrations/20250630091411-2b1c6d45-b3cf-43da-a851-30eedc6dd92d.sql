
-- Allow user_id to be nullable for broadcast notifications
ALTER TABLE public.notifications ALTER COLUMN user_id DROP NOT NULL;

-- Update the RLS policy for users viewing notifications to handle both personal and broadcast notifications
DROP POLICY IF EXISTS "Users can view notifications from their university" ON public.notifications;

CREATE POLICY "Users can view notifications from their university"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    university_id = public.get_user_university_id() AND 
    (user_id = auth.uid() OR user_id IS NULL)
  );

-- Update the user read status policy to only apply to personal notifications
DROP POLICY IF EXISTS "Users can update their own notification read status" ON public.notifications;

CREATE POLICY "Users can update their own notification read status"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND user_id IS NOT NULL)
  WITH CHECK (user_id = auth.uid() AND user_id IS NOT NULL);
