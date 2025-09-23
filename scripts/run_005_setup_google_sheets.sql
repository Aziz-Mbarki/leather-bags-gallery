-- Google Sheets Integration Setup
-- This script documents the Google Sheets configuration

-- Environment variables needed:
-- GOOGLE_SHEETS_API_KEY=AIzaSyBRL3P3FczV3HTw5DS1E3mpLbohlzDH53w
-- GOOGLE_SHEET_ID=1IAeKGY1sXLSlm1yIj-cK0BvpLHshg2g9JyOod-XkPbw
-- GOOGLE_SHEET_NAME=Sac_info

-- Add google_sheets_synced column to orders if not exists
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS google_sheets_synced BOOLEAN DEFAULT false;

-- Create index for better performance on synced orders
CREATE INDEX IF NOT EXISTS idx_orders_google_sheets_synced 
ON public.orders(google_sheets_synced);

-- Update existing orders to mark as not synced
UPDATE public.orders SET google_sheets_synced = false WHERE google_sheets_synced IS NULL;
