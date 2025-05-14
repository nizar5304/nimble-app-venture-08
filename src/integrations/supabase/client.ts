
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://ofnwvyxolilyrcyiafdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbnd2eXhvbGlseXJjeWlhZmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDI2NjcsImV4cCI6MjA2Mjc3ODY2N30.2QmyTZMBwb8fGyZzCf5xeCYl6RoFo1jWfytgtr3Ieeo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
