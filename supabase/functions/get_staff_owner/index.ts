
// RPC Function to get a staff member's owner
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

serve(async (req) => {
  try {
    const { staff_user_id } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the owner_id from staff table
    const { data, error } = await supabase
      .from('staff')
      .select('owner_id')
      .eq('user_id', staff_user_id)
      .single();
      
    if (error) throw error;
    
    return new Response(
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
