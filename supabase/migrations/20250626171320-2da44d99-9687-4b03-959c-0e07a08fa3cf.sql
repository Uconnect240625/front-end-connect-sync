
-- Ensure complaints table exists with proper structure
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  university_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Policy for students to insert their own complaints
CREATE POLICY "Students can create complaints for their university" 
  ON public.complaints 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    university_id = (SELECT university_id FROM public.profiles WHERE id = auth.uid())
  );

-- Policy for students to view their own complaints
CREATE POLICY "Students can view their own complaints" 
  ON public.complaints 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for admins to view complaints from their university
CREATE POLICY "Admins can view complaints from their university" 
  ON public.complaints 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND university_id = complaints.university_id
    )
  );

-- Policy for admins to update complaints from their university
CREATE POLICY "Admins can update complaints from their university" 
  ON public.complaints 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND university_id = complaints.university_id
    )
  );
