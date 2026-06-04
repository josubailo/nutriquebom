import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SERVICE = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Cliente padrão (usuário logado)
export const supabase = createClient(URL, ANON);

// Cliente admin (service role) — usado apenas para criar contas de pacientes
export const supabaseAdmin = SERVICE
  ? createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;
