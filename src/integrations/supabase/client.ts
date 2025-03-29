
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  'https://dqftwndquhmxrprvxqzb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZnR3bmRxdWhteHJwcnZ4cXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTkyNzEsImV4cCI6MjA1ODAzNTI3MX0.V3ib8LBF2wTDcXiLKY_wDZJccPjmBoayDsm8s6iOg0w',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    }
  }
);
