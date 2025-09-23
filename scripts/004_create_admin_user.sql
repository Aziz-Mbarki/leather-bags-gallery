-- This script should be run after the first admin user signs up
-- Update the first user to be an admin (replace with actual user email)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';

-- For now, we'll create a function that can be called to make a user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$;
