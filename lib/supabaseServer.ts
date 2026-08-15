import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseKey) {
  // During development, it's helpful to fail early if env vars are missing.
  // The server code will throw when used without proper env configuration.
  // Leave this as a runtime check rather than blocking import-time errors in all environments.
  console.warn("Supabase env vars are not set: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
