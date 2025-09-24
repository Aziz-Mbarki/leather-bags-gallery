/*
  # Update Product Images

  This script updates the product image URLs to use the actual images 
  available in the public folder instead of placeholder images.

  1. Updates existing products with correct image URLs
  2. Ensures images match the actual files in the public directory
*/

-- Update existing products with correct image URLs
UPDATE public.products 
SET image_url = '/brown-leather-chest-bag-crossbody.jpg'
WHERE name LIKE '%JB4%' OR name LIKE '%poitrine%';

UPDATE public.products 
SET image_url = '/brown-leather-chest-bag-crossbody.jpg'
WHERE name LIKE '%JB5%';

UPDATE public.products 
SET image_url = '/brown-leather-briefcase-business-bag.jpg'
WHERE name LIKE '%JEEP BULUO%' OR name LIKE '%affaire%';

UPDATE public.products 
SET image_url = '/urban-brown-leather-backpack.jpg'
WHERE name LIKE '%dos%' AND name LIKE '%vintage%';

UPDATE public.products 
SET image_url = '/tan-leather-sling-bag-crossbody.jpg'
WHERE name LIKE '%bandoulière%' OR name LIKE '%urbain%';

UPDATE public.products 
SET image_url = '/classic-brown-leather-wallet.jpg'
WHERE name LIKE '%portefeuille%' OR name LIKE '%wallet%';

-- Update any remaining products with placeholder images
UPDATE public.products 
SET image_url = '/elegant-black-leather-handbag-women.jpg'
WHERE image_url LIKE '%placeholder%' AND category LIKE '%main%';

UPDATE public.products 
SET image_url = '/women-brown-leather-shoulder-bag.jpg'
WHERE image_url LIKE '%placeholder%' AND category LIKE '%bandoulière%';

UPDATE public.products 
SET image_url = '/professional-leather-briefcase-brown.jpg'
WHERE image_url LIKE '%placeholder%' AND category LIKE '%business%';

-- Set a default image for any remaining products without proper images
UPDATE public.products 
SET image_url = '/brown-leather-chest-bag-crossbody.jpg'
WHERE image_url IS NULL OR image_url LIKE '%placeholder%';