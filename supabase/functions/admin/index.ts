
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// Create a Supabase client with admin privileges
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AdminRequest {
  action: 'get_users' | 'create_user' | 'update_user_role' | 'delete_user';
  userId?: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: 'admin' | 'owner' | 'staff';
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

    const request: AdminRequest = await req.json();
    const { action } = request;
    let response;

    switch (action) {
      case 'get_users':
        response = await getUsers();
        break;
      case 'create_user':
        response = await createUser(request);
        break;
      case 'update_user_role':
        response = await updateUserRole(request);
        break;
      case 'delete_user':
        response = await deleteUser(request);
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

async function getUsers() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false });
      
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      users: users.map(user => ({
        ...user,
        // Ensure role is always one of the valid types
        role: user.role || 'owner'
      }))
    };
  } catch (error) {
    return { success: false, error: error.message || "Failed to get users" };
  }
}

async function createUser(request: AdminRequest) {
  const { email, password, fullName, role = 'owner' } = request;
  
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(checkError.message);
    }

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password);

    // Insert the new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName || null,
        role
      })
      .select('id, email, full_name, role')
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return {
      success: true,
      user: newUser
    };
  } catch (error) {
    return { success: false, error: error.message || "Error creating user" };
  }
}

async function updateUserRole(request: AdminRequest) {
  const { userId, role } = request;
  
  if (!userId || !role) {
    return { success: false, error: "User ID and role are required" };
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);
      
    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Error updating user role" };
  }
}

async function deleteUser(request: AdminRequest) {
  const { userId } = request;
  
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
      
    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Error deleting user" };
  }
}
