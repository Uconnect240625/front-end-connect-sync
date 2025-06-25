
-- First, drop all dependent policies that use the existing functions
DROP POLICY IF EXISTS "Admins can manage mess menus" ON public.mess_menus;
DROP POLICY IF EXISTS "Admins and clubs can create announcements" ON public.announcements;
DROP POLICY IF EXISTS "Users can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can manage universities" ON public.universities;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles for admin" ON public.profiles;
DROP POLICY IF EXISTS "Allow anonymous to view profiles" ON public.profiles;

-- Drop any other existing policies that might depend on these functions
DROP POLICY IF EXISTS "Admins can manage profiles in same university" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Now drop the existing functions
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_university_id() CASCADE;

-- Create new SECURITY DEFINER functions that bypass RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_user_university_id()
RETURNS uuid
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT university_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Create simple RLS policies for profiles table that don't cause recursion
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can select their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Now create RLS policies for all other tables using the SECURITY DEFINER functions

-- Announcements RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view announcements from their university"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Admins can insert announcements"
  ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Admins can update announcements"
  ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Admins can delete announcements"
  ON public.announcements
  FOR DELETE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Club Events RLS
ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view club events from their university"
  ON public.club_events
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can insert club events"
  ON public.club_events
  FOR INSERT
  TO authenticated
  WITH CHECK (university_id = public.get_user_university_id());

CREATE POLICY "Users can update their own club events"
  ON public.club_events
  FOR UPDATE
  TO authenticated
  USING (club_id = auth.uid() AND university_id = public.get_user_university_id());

CREATE POLICY "Admins can update all club events"
  ON public.club_events
  FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Complaints RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own complaints"
  ON public.complaints
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all complaints from their university"
  ON public.complaints
  FOR SELECT
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Users can insert their own complaints"
  ON public.complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Users can update their own complaints"
  ON public.complaints
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update complaints from their university"
  ON public.complaints
  FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Marketplace Items RLS
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view marketplace items from their university"
  ON public.marketplace_items
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can insert their own marketplace items"
  ON public.marketplace_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Users can update their own marketplace items"
  ON public.marketplace_items
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update all marketplace items"
  ON public.marketplace_items
  FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Mess Menus RLS
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mess menus from their university"
  ON public.mess_menus
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Admins can manage mess menus"
  ON public.mess_menus
  FOR ALL
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  )
  WITH CHECK (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Notes RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

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

-- Notifications RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- PG Listings RLS
ALTER TABLE public.pg_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pg listings from their university"
  ON public.pg_listings
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can insert their own pg listings"
  ON public.pg_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

CREATE POLICY "Users can update their own pg listings"
  ON public.pg_listings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update all pg listings"
  ON public.pg_listings
  FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Universities RLS (read-only for all authenticated users)
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view universities"
  ON public.universities
  FOR SELECT
  TO authenticated
  USING (true);
