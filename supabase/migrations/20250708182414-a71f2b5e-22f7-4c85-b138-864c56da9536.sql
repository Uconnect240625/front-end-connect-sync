
-- Create a table to track policy acceptance
CREATE TABLE public.policy_acceptances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  policy_version TEXT NOT NULL DEFAULT 'v1.0',
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.policy_acceptances ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own policy acceptances
CREATE POLICY "Users can view their own policy acceptances" 
  ON public.policy_acceptances 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own policy acceptances
CREATE POLICY "Users can create their own policy acceptances" 
  ON public.policy_acceptances 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add a column to profiles table to track if user has accepted current policies
ALTER TABLE public.profiles 
ADD COLUMN policies_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN policies_accepted_at TIMESTAMP WITH TIME ZONE;
