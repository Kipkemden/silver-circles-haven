
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dqftwndquhmxrprvxqzb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZnR3bmRxdWhteHJwcnZ4cXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTkyNzEsImV4cCI6MjA1ODAzNTI3MX0.V3ib8LBF2wTDcXiLKY_wDZJccPjmBoayDsm8s6iOg0w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
