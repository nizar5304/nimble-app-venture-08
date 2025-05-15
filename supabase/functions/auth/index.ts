
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// Create a Supabase client with admin privileges
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthRequest {
  action: "signup" | "signin" | "signout";
  email?: string;
  password?: string;
  fullName?: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    role: string | null;
  };
  error?: string;
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

    const authRequest: AuthRequest = await req.json();
    const { action } = authRequest;
    let response: AuthResponse;

    if (action === "signup") {
      response = await handleSignUp(authRequest);
    } else if (action === "signin") {
      response = await handleSignIn(authRequest);
    } else if (action === "signout") {
      response = { success: true };
    } else {
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

async function handleSignUp(request: AuthRequest): Promise<AuthResponse> {
  const { email, password, fullName } = request;
  
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
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
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName || null,
        role: "owner" // Default role for new users
      })
      .select("id, email, full_name, role")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return {
      success: true,
      user: newUser,
      message: "Account created successfully"
    };
  } catch (error) {
    return { success: false, error: error.message || "Error creating account" };
  }
}

async function handleSignIn(request: AuthRequest): Promise<AuthResponse> {
  const { email, password } = request;
  
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    // Get user with password hash
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, email, password_hash, full_name, role")
      .eq("email", email)
      .single();

    if (fetchError) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    // Return user without password_hash
    const { password_hash, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      message: "Signed in successfully"
    };
  } catch (error) {
    return { success: false, error: error.message || "Error signing in" };
  }
}
