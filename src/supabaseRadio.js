import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ukjogbpkggrqkqmqcdjb.supabase.co' // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'sb_publishable_FBVsYNWH8JsSMutVrChPVQ_xubbalQd'           // Reemplaza con tu Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)