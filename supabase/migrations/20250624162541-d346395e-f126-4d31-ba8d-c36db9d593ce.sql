
-- Add missing RLS policy for profile creation
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add RLS policy for admins to manage all profiles in their university
CREATE POLICY "Admins can manage profiles in same university" ON profiles
  FOR ALL USING (
    get_user_role() = 'admin' AND university_id = get_user_university_id()
  );
