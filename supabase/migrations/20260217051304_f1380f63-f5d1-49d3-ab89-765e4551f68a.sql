-- Create flights table for simulated flight bookings
CREATE TABLE public.flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  arrival_city TEXT NOT NULL,
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  class TEXT NOT NULL DEFAULT 'economy',
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own flights" ON public.flights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flights" ON public.flights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own flights" ON public.flights FOR DELETE USING (auth.uid() = user_id);

-- Create hotels table for simulated hotel bookings
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotel_name TEXT NOT NULL,
  city TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_type TEXT NOT NULL DEFAULT 'standard',
  price_per_night NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hotels" ON public.hotels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own hotels" ON public.hotels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own hotels" ON public.hotels FOR DELETE USING (auth.uid() = user_id);

-- Create itineraries table for AI-generated plans
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_result_id UUID REFERENCES public.quiz_results(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  duration TEXT NOT NULL,
  plan JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own itineraries" ON public.itineraries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own itineraries" ON public.itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own itineraries" ON public.itineraries FOR DELETE USING (auth.uid() = user_id);
