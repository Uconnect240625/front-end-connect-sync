
-- Fix the handle_new_user function to resolve variable naming conflict
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  default_university_id uuid;
  user_university_id uuid;
  user_full_name text;
  profile_role user_role;  -- Renamed from user_role to profile_role to avoid conflict
BEGIN
  -- Log the start of profile creation
  RAISE LOG 'Starting profile creation for user: %', NEW.id;
  RAISE LOG 'User email: %', NEW.email;
  RAISE LOG 'Raw user metadata: %', NEW.raw_user_meta_data;
  
  -- Extract user data with fallbacks
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
  profile_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student');
  
  RAISE LOG 'Extracted full_name: %, role: %', user_full_name, profile_role;
  
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
