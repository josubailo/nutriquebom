-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE > SQL Editor
-- Tabela de refeições favoritas (templates reutilizáveis)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.meal_templates (
  id              text PRIMARY KEY,
  nutritionist_id uuid NOT NULL,
  name            text NOT NULL,
  data            jsonb,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.meal_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.meal_templates;
CREATE POLICY "Allow all for auth users" ON public.meal_templates
  USING (true) WITH CHECK (true);
