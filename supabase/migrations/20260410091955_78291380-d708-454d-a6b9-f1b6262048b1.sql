
-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Help requests
CREATE TABLE public.help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own requests" ON public.help_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own requests" ON public.help_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_help_requests_updated_at BEFORE UPDATE ON public.help_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Help request images
CREATE TABLE public.help_request_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  help_request_id UUID REFERENCES public.help_requests(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.help_request_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own images" ON public.help_request_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.help_requests hr WHERE hr.id = help_request_id AND hr.user_id = auth.uid())
);
CREATE POLICY "Users insert own images" ON public.help_request_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.help_requests hr WHERE hr.id = help_request_id AND hr.user_id = auth.uid())
);

-- Contact messages (public, no auth required)
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Storage bucket for help images
INSERT INTO storage.buckets (id, name, public) VALUES ('help-images', 'help-images', true);
CREATE POLICY "Anyone can view help images" ON storage.objects FOR SELECT USING (bucket_id = 'help-images');
CREATE POLICY "Auth users can upload help images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'help-images' AND auth.role() = 'authenticated');
