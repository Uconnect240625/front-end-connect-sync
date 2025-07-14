
-- Create roommate_requests table
CREATE TABLE IF NOT EXISTS public.roommate_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  university_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  location TEXT NOT NULL,
  preferences TEXT,
  contact_number TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.roommate_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to create their own roommate requests
CREATE POLICY "Users can create their own roommate requests" 
  ON public.roommate_requests 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    university_id = (SELECT university_id FROM public.profiles WHERE id = auth.uid())
  );

-- Policy for users to view their own roommate requests
CREATE POLICY "Users can view their own roommate requests" 
  ON public.roommate_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to update their own roommate requests
CREATE POLICY "Users can update their own roommate requests" 
  ON public.roommate_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to view approved roommate requests from their university
CREATE POLICY "Users can view approved roommate requests from their university" 
  ON public.roommate_requests 
  FOR SELECT 
  USING (
    university_id = (SELECT university_id FROM public.profiles WHERE id = auth.uid()) 
    AND approval_status = 'approved'
  );

-- Policy for admins to view all roommate requests from their university
CREATE POLICY "Admins can view all roommate requests from their university" 
  ON public.roommate_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND university_id = roommate_requests.university_id
    )
  );

-- Policy for admins to update roommate requests from their university
CREATE POLICY "Admins can update roommate requests from their university" 
  ON public.roommate_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND university_id = roommate_requests.university_id
    )
  );
