
-- First, drop ALL existing policies on profiles table (including any we missed)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies on the profiles table and drop them
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- Create a comprehensive, robust trigger function with detailed logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_university_id uuid;
  user_university_id uuid;
  user_full_name text;
  user_role user_role;
BEGIN
  -- Log the start of profile creation
  RAISE LOG 'Starting profile creation for user: %', NEW.id;
  RAISE LOG 'User email: %', NEW.email;
  RAISE LOG 'Raw user metadata: %', NEW.raw_user_meta_data;
  
  -- Extract user data with fallbacks
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student');
  
  RAISE LOG 'Extracted full_name: %, role: %', user_full_name, user_role;
  
  -- Get a default university (first one available)
  SELECT id INTO default_university_id FROM universities ORDER BY created_at LIMIT 1;
  RAISE LOG 'Default university ID: %', default_university_id;
  
  -- Try to get university from metadata, fallback to default
  IF NEW.raw_user_meta_data->>'university_id' IS NOT NULL THEN
    BEGIN
      user_university_id := (NEW.raw_user_meta_data->>'university_id')::uuid;
      RAISE LOG 'User provided university ID: %', user_university_id;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE LOG 'Failed to parse university_id from metadata, using default: %', SQLERRM;
        user_university_id := default_university_id;
    END;
  ELSE
    user_university_id := default_university_id;
    RAISE LOG 'No university in metadata, using default: %', user_university_id;
  END IF;
  
  -- Ensure we have a university
  IF user_university_id IS NULL THEN
    RAISE LOG 'ERROR: No university available for profile creation';
    -- Still return NEW to not block user creation
    RETURN NEW;
  END IF;
  
  -- Insert the profile
  BEGIN
    INSERT INTO public.profiles (id, full_name, role, university_id)
    VALUES (NEW.id, user_full_name, user_role, user_university_id);
    
    RAISE LOG 'Profile created successfully for user: % with university: %', NEW.id, user_university_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'ERROR creating profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
      -- Log the specific error but don't block signup
  END;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger (drop and create to ensure it's fresh)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create simple, effective RLS policies for profiles
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile (needed for the trigger)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Allow service role to manage all profiles (for the trigger)
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 5: Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create a function to manually create missing profiles for existing users
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  default_university_id uuid;
BEGIN
  -- Get default university
  SELECT id INTO default_university_id FROM universities ORDER BY created_at LIMIT 1;
  
  -- Create profiles for users who don't have them
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    RAISE LOG 'Creating missing profile for user: %', user_record.id;
    
    INSERT INTO public.profiles (id, full_name, role, university_id)
    VALUES (
      user_record.id,
      COALESCE(user_record.raw_user_meta_data->>'full_name', 'User'),
      COALESCE((user_record.raw_user_meta_data->>'role')::user_role, 'student'),
      COALESCE((user_record.raw_user_meta_data->>'university_id')::uuid, default_university_id)
    );
    
    RAISE LOG 'Created profile for user: %', user_record.id;
  END LOOP;
END;
$$;

-- Execute the function to create missing profiles
SELECT public.create_missing_profiles();

-- Ensure universities table has at least one entry
INSERT INTO universities (name, code) 
VALUES ('Chandigarh University', 'CU')
ON CONFLICT DO NOTHING;
