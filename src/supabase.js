import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rbgmwkmjqiynuafpbaym.supabase.co'
const SUPABASE_KEY = 'sb_publishable_DyuC9M6nsvPmXC6sdVjlyQ_wpRnzIZu'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
