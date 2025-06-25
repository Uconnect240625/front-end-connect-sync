
-- Ensure RLS is enabled on notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view notes from their university" ON public.notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;

-- Create comprehensive RLS policies for notes table
CREATE POLICY "Users can view notes from their university"
  ON public.notes
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can insert their own notes"
  ON public.notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Users can update their own notes"
  ON public.notes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notes"
  ON public.notes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
