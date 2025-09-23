-- Create the main tables for the leather bag e-commerce system
-- Following Supabase best practices with proper RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  governorate TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  color TEXT,
  material TEXT DEFAULT 'Cuir véritable',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_governorate TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cash_on_delivery',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_admin_all" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- RLS Policies for cart_items
CREATE POLICY "cart_items_select_own" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_items_insert_own" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_items_update_own" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_items_delete_own" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_all" ON public.orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- RLS Policies for order_items
CREATE POLICY "order_items_select_via_order" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);
CREATE POLICY "order_items_admin_all" ON public.order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, color, material, stock_quantity) VALUES
('Sac à Main Élégant', 'Un magnifique sac à main en cuir véritable, parfait pour toutes les occasions. Fabriqué avec un savoir-faire artisanal exceptionnel.', 299.99, '/placeholder.svg?height=400&width=400', 'Sacs à Main', 'Marron', 'Cuir véritable', 15),
('Sac Bandoulière Vintage', 'Sac bandoulière au style vintage intemporel. Idéal pour un look décontracté chic avec une touche d''authenticité.', 249.99, '/placeholder.svg?height=400&width=400', 'Sacs Bandoulière', 'Noir', 'Cuir véritable', 20),
('Sac de Voyage Luxe', 'Grand sac de voyage spacieux et résistant. Parfait pour vos escapades avec style et praticité.', 449.99, '/placeholder.svg?height=400&width=400', 'Sacs de Voyage', 'Cognac', 'Cuir véritable', 8),
('Sac Cabas Moderne', 'Sac cabas contemporain aux lignes épurées. Idéal pour le quotidien avec son design fonctionnel et élégant.', 199.99, '/placeholder.svg?height=400&width=400', 'Sacs Cabas', 'Beige', 'Cuir véritable', 25),
('Sac Pochette Soirée', 'Élégante pochette pour vos soirées spéciales. Finition raffinée et détails dorés pour un look sophistiqué.', 149.99, '/placeholder.svg?height=400&width=400', 'Pochettes', 'Doré', 'Cuir véritable', 12),
('Sac à Dos Urbain', 'Sac à dos moderne alliant style et fonctionnalité. Parfait pour la vie urbaine active.', 329.99, '/placeholder.svg?height=400&width=400', 'Sacs à Dos', 'Marron Foncé', 'Cuir véritable', 18),
('Sac Besace Artisanal', 'Sac besace fait main avec des techniques traditionnelles. Chaque pièce est unique et authentique.', 279.99, '/placeholder.svg?height=400&width=400', 'Sacs Besace', 'Tan', 'Cuir véritable', 10),
('Sac Shopping Chic', 'Grand sac shopping élégant pour vos sorties. Spacieux et stylé pour transporter tout ce dont vous avez besoin.', 219.99, '/placeholder.svg?height=400&width=400', 'Sacs Shopping', 'Bordeaux', 'Cuir véritable', 22),
('Sac Cartable Rétro', 'Sac cartable au charme rétro. Parfait pour un style vintage avec une fonctionnalité moderne.', 259.99, '/placeholder.svg?height=400&width=400', 'Sacs Cartable', 'Camel', 'Cuir véritable', 14),
('Sac Hobo Bohème', 'Sac hobo au style bohème décontracté. Idéal pour un look libre et naturel.', 189.99, '/placeholder.svg?height=400&width=400', 'Sacs Hobo', 'Olive', 'Cuir véritable', 16),
('Sac Baguette Parisien', 'Petit sac baguette inspiré du style parisien. Compact et élégant pour vos sorties en ville.', 169.99, '/placeholder.svg?height=400&width=400', 'Sacs Baguette', 'Marine', 'Cuir véritable', 20),
('Sac Fourre-tout Premium', 'Sac fourre-tout haut de gamme avec finitions luxueuses. L''accessoire parfait pour la femme moderne.', 379.99, '/placeholder.svg?height=400&width=400', 'Sacs Fourre-tout', 'Crème', 'Cuir véritable', 9);

-- Create admin user (this will be handled by the trigger when a user signs up with admin role)
-- The actual admin user creation will happen through the auth system
