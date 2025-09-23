-- Create additional functions for user profile management

-- Function to get user profile with role
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  governorate TEXT,
  postal_code TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.phone,
    p.address,
    p.city,
    p.governorate,
    p.postal_code,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
  user_id UUID,
  new_full_name TEXT DEFAULT NULL,
  new_phone TEXT DEFAULT NULL,
  new_address TEXT DEFAULT NULL,
  new_city TEXT DEFAULT NULL,
  new_governorate TEXT DEFAULT NULL,
  new_postal_code TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    full_name = COALESCE(new_full_name, full_name),
    phone = COALESCE(new_phone, phone),
    address = COALESCE(new_address, address),
    city = COALESCE(new_city, city),
    governorate = COALESCE(new_governorate, governorate),
    postal_code = COALESCE(new_postal_code, postal_code),
    updated_at = timezone('utc'::text, now())
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
