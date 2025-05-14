
import React, { useEffect, useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration_days: number;
}

const Subscription: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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

    fetchPlans();
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    // Here you would integrate with Razorpay
    toast({
      title: "Subscription initiated",
      description: "Processing your subscription request...",
    });
    
    // Implementation for RazorPay would go here
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
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Subscribe Now
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
