-- Add shared_token column for public sharing
ALTER TABLE public.itineraries ADD COLUMN shared_token text UNIQUE DEFAULT NULL;

-- Allow anyone to view shared itineraries by token
CREATE POLICY "Anyone can view shared itineraries by token"
ON public.itineraries
FOR SELECT
TO anon, authenticated
USING (shared_token IS NOT NULL);
