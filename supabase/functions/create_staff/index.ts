
// RPC Function to create a staff member
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

interface CreateStaffParams {
  p_owner_id: string;
  p_user_id: string;
  p_staff_name: string;
}

serve(async (req) => {
  try {
    const { p_owner_id, p_user_id, p_staff_name } = await req.json() as CreateStaffParams;
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Insert staff record
    const { data, error } = await supabase
      .from('staff')
      .insert({
        owner_id: p_owner_id,
        user_id: p_user_id,
        staff_name: p_staff_name
      })
      .select()
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
