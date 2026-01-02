-- Remove email column from profiles table since emails are already securely stored in auth.users
-- This prevents potential data exposure if RLS is ever bypassed

-- First, update the handle_new_user function to not insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  safe_name text;
BEGIN
  -- Sanitize name from metadata (limit length, strip dangerous characters)
  safe_name := COALESCE(
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'full_name',
    split_part(COALESCE(NEW.email, ''), '@', 1)
  );
  
  -- Limit name length and remove potentially dangerous characters
  safe_name := regexp_replace(left(COALESCE(safe_name, 'User'), 100), '[<>"\x00-\x1f]', '', 'g');
  
  -- Insert with validated data, use explicit schema references
  -- Email is NOT stored here - it's available in auth.users
  INSERT INTO public.profiles (user_id, name)
  VALUES (
    NEW.id,
    safe_name
  );
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Now drop the email column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;