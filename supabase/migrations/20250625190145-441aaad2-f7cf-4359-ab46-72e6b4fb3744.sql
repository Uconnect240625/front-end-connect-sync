
-- First, completely disable RLS on profiles table temporarily to break recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on ALL tables to start completely fresh
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow viewing all profiles for admin" ON public.profiles;
DROP POLICY IF EXISTS "Allow anonymous to view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles in same university" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Drop all other table policies
DROP POLICY IF EXISTS "Users can view announcements from their university" ON public.announcements;
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;

DROP POLICY IF EXISTS "Users can view club events from their university" ON public.club_events;
DROP POLICY IF EXISTS "Users can insert club events" ON public.club_events;
DROP POLICY IF EXISTS "Users can update their own club events" ON public.club_events;
DROP POLICY IF EXISTS "Admins can update all club events" ON public.club_events;

DROP POLICY IF EXISTS "Users can view their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can view all complaints from their university" ON public.complaints;
DROP POLICY IF EXISTS "Users can insert their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can update their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can update complaints from their university" ON public.complaints;

DROP POLICY IF EXISTS "Users can view marketplace items from their university" ON public.marketplace_items;
DROP POLICY IF EXISTS "Users can insert their own marketplace items" ON public.marketplace_items;
DROP POLICY IF EXISTS "Users can update their own marketplace items" ON public.marketplace_items;
DROP POLICY IF EXISTS "Admins can update all marketplace items" ON public.marketplace_items;

DROP POLICY IF EXISTS "Users can view mess menus from their university" ON public.mess_menus;
DROP POLICY IF EXISTS "Admins can manage mess menus" ON public.mess_menus;

DROP POLICY IF EXISTS "Users can view notes from their university" ON public.notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view pg listings from their university" ON public.pg_listings;
DROP POLICY IF EXISTS "Users can insert their own pg listings" ON public.pg_listings;
DROP POLICY IF EXISTS "Users can update their own pg listings" ON public.pg_listings;
DROP POLICY IF EXISTS "Admins can update all pg listings" ON public.pg_listings;

DROP POLICY IF EXISTS "All authenticated users can view universities" ON public.universities;

-- Recreate the SECURITY DEFINER functions with better error handling
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_university_id() CASCADE;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_result user_role;
BEGIN
  -- Return early if no user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN 'student'::user_role;
  END IF;
  
  -- Get role from profiles table
  SELECT role INTO user_role_result 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Return default if no profile found
  RETURN COALESCE(user_role_result, 'student'::user_role);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_university_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  university_id_result uuid;
BEGIN
  -- Return null if no user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get university_id from profiles table
  SELECT university_id INTO university_id_result 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN university_id_result;
END;
$$;

-- Now create SIMPLE, NON-RECURSIVE policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies - NO admin access to prevent recursion
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
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

-- Universities - public access for registration
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view universities"
  ON public.universities
  FOR SELECT
  TO public
  USING (true);

-- All other tables - using SECURITY DEFINER functions
-- Announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view announcements from their university"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Admins can manage announcements"
  ON public.announcements
  FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Club Events
ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view club events"
  ON public.club_events
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Clubs can manage their events"
  ON public.club_events
  FOR ALL
  TO authenticated
  USING (club_id = auth.uid())
  WITH CHECK (
    club_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

-- Complaints
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own complaints"
  ON public.complaints
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

-- Marketplace Items
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view marketplace items"
  ON public.marketplace_items
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can manage their own items"
  ON public.marketplace_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

-- Mess Menus
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mess menus"
  ON public.mess_menus
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Admins can manage mess menus"
  ON public.mess_menus
  FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (
    public.get_user_role() = 'admin' AND 
    university_id = public.get_user_university_id()
  );

-- Notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes from their university"
  ON public.notes
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can manage their own notes"
  ON public.notes
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- PG Listings
ALTER TABLE public.pg_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pg listings"
  ON public.pg_listings
  FOR SELECT
  TO authenticated
  USING (university_id = public.get_user_university_id());

CREATE POLICY "Users can manage their own listings"
  ON public.pg_listings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND 
    university_id = public.get_user_university_id()
  );
