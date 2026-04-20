-- 1. Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Travel buddies
CREATE TABLE public.travel_buddies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  travel_start DATE NOT NULL,
  travel_end DATE NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.travel_buddies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can browse buddies"
ON public.travel_buddies FOR SELECT
TO authenticated
USING (is_active = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users insert own buddy profile"
ON public.travel_buddies FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own buddy profile"
ON public.travel_buddies FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own buddy profile"
ON public.travel_buddies FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins delete any buddy profile"
ON public.travel_buddies FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Buddy requests
CREATE TYPE public.buddy_request_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE public.buddy_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_buddy_id UUID NOT NULL REFERENCES public.travel_buddies(id) ON DELETE CASCADE,
  message TEXT,
  status buddy_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sender_id, receiver_buddy_id)
);

ALTER TABLE public.buddy_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sender or receiver can view request"
ON public.buddy_requests FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Admins can view all requests"
ON public.buddy_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sender creates request"
ON public.buddy_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id AND auth.uid() <> receiver_id);

CREATE POLICY "Receiver updates request"
ON public.buddy_requests FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

CREATE POLICY "Sender deletes own request"
ON public.buddy_requests FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- 4. Exploration proofs
CREATE TABLE public.exploration_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  title TEXT NOT NULL,
  experience TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  visited_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exploration_proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view proofs"
ON public.exploration_proofs FOR SELECT
USING (TRUE);

CREATE POLICY "Users insert own proof"
ON public.exploration_proofs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own proof"
ON public.exploration_proofs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own proof"
ON public.exploration_proofs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins delete any proof"
ON public.exploration_proofs FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Storage bucket for proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', TRUE);

CREATE POLICY "Public can view proof images"
ON storage.objects FOR SELECT
USING (bucket_id = 'proofs');

CREATE POLICY "Authenticated users upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own proof images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own proof images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Triggers for updated_at
CREATE TRIGGER update_travel_buddies_updated_at
BEFORE UPDATE ON public.travel_buddies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buddy_requests_updated_at
BEFORE UPDATE ON public.buddy_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exploration_proofs_updated_at
BEFORE UPDATE ON public.exploration_proofs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();