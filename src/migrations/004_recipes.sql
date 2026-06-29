-- ============================================================
-- EXECUTE ESTE SQL NO SUPABASE > SQL Editor
-- ============================================================

-- Receitas (combinações de alimentos usadas como substituição de refeição inteira)
CREATE TABLE IF NOT EXISTS public.recipes (
  id              text PRIMARY KEY,
  nutritionist_id uuid NOT NULL,
  name            text NOT NULL,
  data            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for auth users" ON public.recipes;
CREATE POLICY "Allow all for auth users" ON public.recipes
  USING (true) WITH CHECK (true);
