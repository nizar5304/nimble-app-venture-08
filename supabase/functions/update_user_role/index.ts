
// RPC Function to update a user's role
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

interface UserRoleParams {
  user_id: string;
  user_role: 'admin' | 'owner' | 'staff';
}

serve(async (req) => {
  try {
    const { user_id, user_role } = await req.json() as UserRoleParams;
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Update profile with role
    const { error } = await supabase
      .from('profiles')
      .update({ role: user_role })
      .eq('id', user_id);
      
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
