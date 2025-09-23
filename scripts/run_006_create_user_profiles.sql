-- Enhanced user profiles setup
-- Add additional columns for better user management

-- Add phone and address columns to profiles if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS governorate TEXT;

-- Create index for better performance on role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Update RLS policies for enhanced profile management
DROP POLICY IF EXISTS "Profiles are insertable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are insertable by authenticated users" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);
