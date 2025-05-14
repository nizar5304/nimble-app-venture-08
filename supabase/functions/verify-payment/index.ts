
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan_id, user_id } = await req.json();
    
    // In a real implementation, you would verify the signature with Razorpay
    // This is just a simplified example
    const isValid = razorpay_payment_id && razorpay_signature;
    
    // Get payment details (in a real implementation, you would fetch this from Razorpay's API)
    // For now, we'll create a mock payment amount
    const paymentAmount = 999;
    
    // Create a payment log entry
    const { error: paymentError } = await supabaseClient
      .from("payment_logs")
      .insert({
        user_id: user_id,
        payment_id: razorpay_payment_id,
        amount: paymentAmount,
        status: isValid ? "success" : "failed",
        metadata: { 
          razorpay_order_id, 
          razorpay_signature,
          verified: isValid 
        },
      });
      
    if (paymentError) {
      throw paymentError;
    }
    
    if (isValid) {
      // Get the plan details
      const { data: planData, error: planError } = await supabaseClient
        .from("subscription_plans")
        .select("*")
        .eq("id", plan_id)
        .single();
        
      if (planError) {
        throw planError;
      }
      
      // Calculate end date
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + planData.duration_days);
      
      // Create subscription
      const { error: subscriptionError } = await supabaseClient
        .from("user_subscriptions")
        .insert({
          user_id: user_id,
          plan_id: plan_id,
          status: "active",
          end_date: endDate.toISOString(),
          payment_id: razorpay_payment_id,
        });
        
      if (subscriptionError) {
        throw subscriptionError;
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error("Payment verification failed");
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
