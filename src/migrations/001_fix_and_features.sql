-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE > SQL Editor
-- ============================================================

-- 1. Garante que a tabela profiles existe e tem a trigger correta
CREATE TABLE IF NOT EXISTS public.profiles (
  id   uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'patient',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service can insert profiles" ON public.profiles;
CREATE POLICY "Service can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Trigger que cria o perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'role', 'patient'))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Adiciona coluna next_appointment na tabela patients (se não existir)
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS next_appointment text;

-- 3. Tabela de mensagens/dúvidas dos pacientes
CREATE TABLE IF NOT EXISTS public.patient_messages (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id      text NOT NULL,
  nutritionist_id uuid NOT NULL,
  content         text NOT NULL,
  reply           text,
  replied_at      timestamptz,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.patient_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.patient_messages;
CREATE POLICY "Allow all for auth users" ON public.patient_messages
  USING (true) WITH CHECK (true);

-- 4. Tabela de solicitações de vídeo chamada
CREATE TABLE IF NOT EXISTS public.patient_video_requests (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id      text NOT NULL,
  nutritionist_id uuid NOT NULL,
  message         text,
  preferred_date  text,
  status          text DEFAULT 'pending',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.patient_video_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.patient_video_requests;
CREATE POLICY "Allow all for auth users" ON public.patient_video_requests
  USING (true) WITH CHECK (true);

-- 5. Tabela de fotos dos pacientes
CREATE TABLE IF NOT EXISTS public.patient_photos (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id      text NOT NULL,
  nutritionist_id uuid NOT NULL,
  storage_path    text NOT NULL,
  public_url      text,
  caption         text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.patient_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.patient_photos;
CREATE POLICY "Allow all for auth users" ON public.patient_photos
  USING (true) WITH CHECK (true);

-- 6. Cria o bucket de fotos no Storage (execute separado se necessário)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('patient-photos', 'patient-photos', true)
-- ON CONFLICT DO NOTHING;
