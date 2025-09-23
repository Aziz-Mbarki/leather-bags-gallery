-- This script will be used to create an admin user after authentication is set up
-- For now, we'll create a placeholder that can be updated later

-- Create a function to promote a user to admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(TEXT) TO authenticated;
