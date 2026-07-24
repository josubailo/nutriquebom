-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE > SQL Editor
-- Adiciona coluna 'source' para identificar quem registrou o feedback
-- ============================================================

ALTER TABLE public.patient_feedbacks
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'nutritionist';
-- valores: 'nutritionist' | 'patient'
