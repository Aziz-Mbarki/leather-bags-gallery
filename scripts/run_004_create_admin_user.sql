-- Note: This script documents admin user creation
-- The actual admin user will be created through the authentication system
-- Default admin credentials (to be changed after first login):
-- Email: admin@sacscuir.com
-- Password: AdminSacs2024!

-- This script will be executed after user registration to promote to admin
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@sacscuir.com';

-- For now, we'll create a placeholder that can be updated later
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES (
  gen_random_uuid(),
  'admin@sacscuir.com',
  'Administrateur',
  'admin'
) ON CONFLICT (email) DO UPDATE SET role = 'admin';
