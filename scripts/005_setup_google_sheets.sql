-- This script creates a function to help setup Google Sheets integration
-- Instructions for setting up Google Sheets:

/*
1. Create a new Google Sheet with the following headers in row 1:
   A1: "Numéro de commande"
   B1: "Date"
   C1: "Nom client"
   D1: "Téléphone"
   E1: "Gouvernorat"
   F1: "Articles"
   G1: "Total"
   H1: "Statut"

2. Get your Google Sheet ID from the URL:
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   
3. Create a Google Cloud Project and enable the Google Sheets API:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Restrict the API key to Google Sheets API only

4. Make your Google Sheet public or share it with the service account:
   - Click "Share" button in Google Sheets
   - Change permissions to "Anyone with the link can view"
   - OR create a service account and share the sheet with the service account email

5. Add these environment variables to your Vercel project:
   - GOOGLE_SHEETS_API_KEY: Your Google Sheets API key
   - GOOGLE_SHEET_ID: Your Google Sheet ID
   - GOOGLE_SHEET_NAME: Sheet name (default: "Commandes")

6. Test the integration by placing an order
*/

-- Create a function to update order status when Google Sheets row is updated
CREATE OR REPLACE FUNCTION public.update_order_google_sheets_row(
  order_uuid UUID,
  row_number INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.orders 
  SET google_sheet_row = row_number
  WHERE id = order_uuid;
END;
$$;
