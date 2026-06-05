-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE > SQL Editor
-- Corrige permissões do Storage para upload de fotos de pacientes
-- ============================================================

-- 1. Cria o bucket patient-photos se não existir (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-photos', 'patient-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Storage: paciente autenticado pode fazer upload na própria pasta
DROP POLICY IF EXISTS "Patients can upload own photos" ON storage.objects;
CREATE POLICY "Patients can upload own photos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'patient-photos'
    AND (storage.foldername(name))[1] = (
      SELECT id::text FROM public.patients WHERE user_id = auth.uid() LIMIT 1
    )
  );

DROP POLICY IF EXISTS "Anyone can view patient photos" ON storage.objects;
CREATE POLICY "Anyone can view patient photos" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'patient-photos');
