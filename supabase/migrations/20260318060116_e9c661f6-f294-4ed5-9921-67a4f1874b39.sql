-- Allow users to update their own itineraries (needed for setting shared_token)
CREATE POLICY "Users can update own itineraries"
ON public.itineraries
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);