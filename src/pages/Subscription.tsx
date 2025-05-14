
import React, { useEffect, useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration_days: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Subscription: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPaymentFor, setProcessingPaymentFor] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("subscription_plans").select("*");
        
        if (error) {
          throw error;
        }
        
        // Transform the JSON features to string array
        const transformedData = data.map(plan => ({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features : []
        }));
        
        setPlans(transformedData as Plan[]);
      } catch (error: any) {
        console.error("Error fetching plans:", error);
        toast({
          title: "Error loading subscription plans",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => {
          toast({
            title: "Error loading Razorpay",
            description: "Could not load the payment gateway. Please try again later.",
            variant: "destructive",
          });
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      await loadRazorpayScript();
      await fetchPlans();
    };

    init();
  }, [toast]);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to subscribe to a plan",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setProcessingPaymentFor(plan.id);
    toast({
      title: "Subscription initiated",
      description: "Processing your subscription request...",
    });
    
    try {
      // Create an order on the server
      const order = {
        planId: plan.id,
        amount: plan.price,
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        notes: {
          planName: plan.name,
          userId: user.id
        }
      };
      
      // In a real implementation, you would create this order with Razorpay's API
      // But for this demo, we're creating a mock order directly
      const options = {
        key: "rzp_test_YOUR_KEY_ID", // Replace with your test key ID
        amount: plan.price,
        currency: "INR",
        name: "PhoneMetrics",
        description: `${plan.name} Subscription`,
        order_id: `order_${Date.now()}`, // This should come from your server in a real implementation
        handler: async function(response: any) {
          // Send payment verification details to your server
          try {
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: plan.id,
                user_id: user.id
              }
            });
            
            if (error) throw error;
            
            toast({
              title: "Payment successful!",
              description: `You are now subscribed to the ${plan.name} plan.`,
            });
            
            // Refresh the page to update the UI
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment verification failed",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        },
        theme: {
          color: "#ec4899",
        },
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment failed",
          description: response.error.description,
          variant: "destructive",
        });
      });
      
      rzp.open();
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingPaymentFor(null);
    }
  };

  return (
    <MobileLayout title="Subscription Plans">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Choose Your Plan</h1>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            plans.map((plan) => (
              <Card key={plan.id} className="border-2 hover:border-pink-300 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="text-3xl font-bold mb-4">
                    ₹{(plan.price / 100).toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={() => handleSubscribe(plan)}
                    disabled={processingPaymentFor === plan.id}
                  >
                    {processingPaymentFor === plan.id ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : "Subscribe Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Subscription;
