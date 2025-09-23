# Cuir Élégant - E-commerce Platform

A modern e-commerce platform for luxury leather bags in Tunisia, built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🛍️ **Product Gallery** - Browse luxury leather bags with filtering and search
- 🛒 **Shopping Cart** - Add items to cart with persistent storage
- 📋 **Order Management** - Complete order flow with Tunisian governorates
- 📊 **Google Sheets Integration** - Automatic order tracking in Google Sheets
- 👤 **User Authentication** - Secure login/register with Supabase Auth
- 🔐 **Admin Dashboard** - Full CRUD operations for products and orders
- 📱 **Responsive Design** - Mobile-first design with elegant UI
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Supabase account
- Google Cloud account (for Sheets integration)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd cuir-elegant-gallery
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts/` folder in order
   - Configure Row Level Security (RLS) policies

4. **Environment Variables**
   Create a `.env.local` file with:
   \`\`\`env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Development redirect URL
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   
   # Google Sheets (optional)
   GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SHEET_NAME=Commandes
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL scripts in order:

1. `001_create_tables.sql` - Creates main tables
2. `002_create_profile_trigger.sql` - Sets up user profile triggers
3. `003_seed_products.sql` - Seeds initial products
4. `004_create_admin_user.sql` - Creates admin user
5. `005_setup_google_sheets.sql` - Google Sheets integration setup
6. `006_create_user_profiles.sql` - User profiles and roles

## Google Sheets Integration

1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create an API key
4. Create a Google Sheet with headers:
   - Numéro de commande
   - Date
   - Nom client
   - Téléphone
   - Gouvernorat
   - Articles
   - Total
   - Statut

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set Environment Variables**
   Add all environment variables in Vercel dashboard

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Environment Variables for Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_SHEETS_API_KEY` (optional)
- `GOOGLE_SHEET_ID` (optional)
- `GOOGLE_SHEET_NAME` (optional)

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── commande/          # Order pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client setup
│   ├── contexts/          # React contexts
│   └── types.ts           # TypeScript types
├── scripts/               # Database scripts
└── public/                # Static assets
\`\`\`

## Features Overview

### Customer Features
- Browse products with filtering
- Add items to shopping cart
- Place orders with delivery information
- User account management

### Admin Features
- Product management (CRUD)
- Order management and status updates
- Dashboard with analytics
- User role management

### Technical Features
- Server-side rendering with Next.js
- Real-time data with Supabase
- Responsive design
- Type-safe with TypeScript
- Optimized images and performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support, contact the development team or create an issue in the repository.
