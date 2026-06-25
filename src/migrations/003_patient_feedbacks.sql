-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE > SQL Editor
-- ============================================================

-- Tabela de feedbacks/acompanhamento semanal dos pacientes
CREATE TABLE IF NOT EXISTS public.patient_feedbacks (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id      text NOT NULL,
  nutritionist_id uuid NOT NULL,
  weight          numeric,
  content         text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.patient_feedbacks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.patient_feedbacks;
CREATE POLICY "Allow all for auth users" ON public.patient_feedbacks
  USING (true) WITH CHECK (true);
