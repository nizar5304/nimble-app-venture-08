
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// Create a Supabase client with admin privileges
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface StaffRequest {
  action: 'create_staff' | 'delete_staff' | 'get_staff';
  owner_id?: string;
  staff_id?: string;
  email?: string;
  password?: string;
  staff_name?: string;
}

serve(async (req) => {
  try {
    // Handle preflight CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Handle actual request
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { 
          status: 405,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const request: StaffRequest = await req.json();
    const { action } = request;
    let response;

    switch (action) {
      case 'create_staff':
        response = await createStaff(request);
        break;
      case 'delete_staff':
        response = await deleteStaff(request);
        break;
      case 'get_staff':
        response = await getStaff(request);
        break;
      default:
        response = { success: false, error: "Invalid action" };
    }

    return new Response(JSON.stringify(response), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Unknown error" }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});

async function createStaff(request: StaffRequest) {
  const { owner_id, email, password, staff_name } = request;
  
  if (!owner_id || !email || !password || !staff_name) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // Check if user with this email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(checkError.message);
    }

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Create transaction for atomic operations
    // 1. Create user in users table
    const passwordHash = await bcrypt.hash(password);
    
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: staff_name,
        role: 'staff'
      })
      .select('id')
      .single();
      
    if (userError) throw new Error(userError.message);
    
    // 2. Create staff record
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .insert({
        owner_id,
        user_id: newUser.id,
        staff_name
      })
      .select()
      .single();
      
    if (staffError) {
      // If staff creation fails, attempt to delete the user
      await supabase.from('users').delete().eq('id', newUser.id);
      throw new Error(staffError.message);
    }

    return {
      success: true,
      staff: {
        ...staffData,
        email
      }
    };
  } catch (error) {
    return { success: false, error: error.message || "Error creating staff" };
  }
}

async function deleteStaff(request: StaffRequest) {
  const { staff_id } = request;
  
  if (!staff_id) {
    return { success: false, error: "Staff ID is required" };
  }

  try {
    // Get the user_id from staff record
    const { data: staff, error: getError } = await supabase
      .from('staff')
      .select('user_id')
      .eq('id', staff_id)
      .single();
      
    if (getError) throw new Error(getError.message);
    
    // Delete staff record first
    const { error: deleteStaffError } = await supabase
      .from('staff')
      .delete()
      .eq('id', staff_id);
      
    if (deleteStaffError) throw new Error(deleteStaffError.message);
    
    // Then delete the user account
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', staff.user_id);
      
    if (deleteUserError) throw new Error(deleteUserError.message);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Error deleting staff" };
  }
}

async function getStaff(request: StaffRequest) {
  const { owner_id } = request;
  
  if (!owner_id) {
    return { success: false, error: "Owner ID is required" };
  }

  try {
    // Join staff table with users to get emails
    const { data: staffMembers, error } = await supabase
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
      
    if (error) throw new Error(error.message);
    
    // Transform for easier frontend use
    const formattedStaff = staffMembers.map(staff => ({
      id: staff.id,
      user_id: staff.user_id,
      staff_name: staff.staff_name,
      created_at: staff.created_at,
      email: staff.users ? staff.users.email : 'N/A'
    }));

    return { 
      success: true,
      staff: formattedStaff
    };
  } catch (error) {
    return { success: false, error: error.message || "Error fetching staff" };
  }
}
