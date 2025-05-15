
// RPC Function to get all staff members for an owner
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

serve(async (req) => {
  try {
    const { owner_id } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get staff with user emails
    const { data, error } = await supabase
      .from('staff')
      .select(`
        id, 
        user_id,
        staff_name,
        created_at,
        users:user_id (
          email
        )
      `)
      .eq('owner_id', owner_id);
      
    if (error) throw error;
    
    // Format response for frontend
    const formattedStaff = data.map((staff) => ({
      id: staff.id,
      user_id: staff.user_id,
      staff_name: staff.staff_name,
      created_at: staff.created_at,
      email: staff.users ? staff.users.email : 'N/A'
    }));
    
    return new Response(
      JSON.stringify(formattedStaff),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
