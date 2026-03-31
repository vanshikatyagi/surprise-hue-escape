
-- Add contact_type column to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS contact_type text NOT NULL DEFAULT 'mystery_trip';

-- Create local_secrets_category enum
CREATE TYPE public.local_secret_category AS ENUM ('hidden_place', 'food_spot', 'local_tip', 'less_crowded');

-- Create local_secrets table
CREATE TABLE public.local_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category local_secret_category NOT NULL DEFAULT 'local_tip',
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.local_secrets ENABLE ROW LEVEL SECURITY;

-- Everyone can read local secrets
CREATE POLICY "Anyone can read local secrets"
  ON public.local_secrets FOR SELECT
  TO authenticated, anon
  USING (true);

-- Authenticated users can insert their own
CREATE POLICY "Users can insert own local secrets"
  ON public.local_secrets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own
CREATE POLICY "Users can update own local secrets"
  ON public.local_secrets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own
CREATE POLICY "Users can delete own local secrets"
  ON public.local_secrets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
