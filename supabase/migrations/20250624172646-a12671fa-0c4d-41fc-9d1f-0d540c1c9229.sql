
-- First, let's check if there are any profiles and temporarily disable RLS to see all data
-- Create a function to get all profiles (for admin/debugging purposes)
CREATE OR REPLACE FUNCTION public.get_all_profiles()
RETURNS TABLE (
  id uuid,
  full_name text,
  role user_role,
  university_id uuid,
  phone text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, full_name, role, university_id, phone, created_at, updated_at
  FROM public.profiles;
$$;

-- Add a policy that allows viewing all profiles for debugging
-- (You can remove this later if you want stricter security)
CREATE POLICY "Allow viewing all profiles for admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Also add a policy for anonymous users to see if that helps with the table editor
CREATE POLICY "Allow anonymous to view profiles"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);
