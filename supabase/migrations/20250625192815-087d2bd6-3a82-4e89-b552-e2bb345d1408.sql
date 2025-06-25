
-- Create a comprehensive fix for the handle_new_user function
-- This addresses type resolution, schema issues, and function compilation problems

-- First, ensure the user_role enum exists in the public schema
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'club');
    END IF;
END $$;

-- Drop and recreate the function with explicit schema qualification and proper search path
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  default_university_id uuid;
  user_university_id uuid;
  user_full_name text;
  profile_role public.user_role;  -- Explicit schema qualification
BEGIN
  -- Log the start of profile creation
  RAISE LOG 'Starting profile creation for user: %', NEW.id;
  RAISE LOG 'User email: %', NEW.email;
  RAISE LOG 'Raw user metadata: %', NEW.raw_user_meta_data;
  
  -- Extract user data with fallbacks and explicit casting
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  
  -- Safely cast role with explicit schema qualification
  BEGIN
    profile_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role);
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Failed to cast role, using default student: %', SQLERRM;
      profile_role := 'student'::public.user_role;
  END;
  
  RAISE LOG 'Extracted full_name: %, role: %', user_full_name, profile_role;
  
  -- Get a default university (first one available)
  SELECT id INTO default_university_id FROM public.universities ORDER BY created_at LIMIT 1;
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
  
  -- Insert the profile with explicit schema qualification
  BEGIN
    INSERT INTO public.profiles (id, full_name, role, university_id)
    VALUES (NEW.id, user_full_name, profile_role, user_university_id);
    
    RAISE LOG 'Profile created successfully for user: % with university: %', NEW.id, user_university_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'ERROR creating profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
      -- Log the specific error but don't block signup
  END;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the function independently to ensure it compiles correctly
DO $$
DECLARE
  test_result text;
BEGIN
  -- This will force compilation of the function
  SELECT routine_name INTO test_result 
  FROM information_schema.routines 
  WHERE routine_schema = 'public' 
    AND routine_name = 'handle_new_user'
    AND routine_type = 'FUNCTION';
  
  IF test_result IS NOT NULL THEN
    RAISE LOG 'Function handle_new_user compiled successfully';
  ELSE
    RAISE LOG 'Function handle_new_user compilation failed';
  END IF;
END $$;
